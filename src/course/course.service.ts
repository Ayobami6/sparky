import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorException } from 'src/utils/error-exceptions';
import { CourseEntity } from './course.entity';
import { DataSource, Repository } from 'typeorm';
import { RedisService } from 'src/utils/redis.service';
import { LoggerService } from 'src/logger.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { v4 as uuid } from 'uuid';
import { EditCourseDto } from './dto/editcourse.dto';

@Injectable()
export class CourseService {
  private errorException = new ErrorException();
  private courseRepo;

  constructor(
    private dataSource: DataSource,
    private redisService: RedisService,
    private loggerService: LoggerService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
  ) {
    this.courseRepo = this.dataSource.getRepository(CourseEntity);
  }

  async uploadCourse(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    try {
      const thumbnail = createCourseDto.thumbnail;
      // if there is a thumbnail data upload to cloudinary
      if (thumbnail) {
        const response = await this.cloudinaryService.upload(thumbnail, {
          folder: 'courses',
        });
        createCourseDto.thumbnail = {
          public_id: response.public_id,
          url: response.secure_url,
        };
      }
      createCourseDto.id = uuid();
      createCourseDto.courseData.map((course) => {
        course.id = uuid();
      });
      const course = this.courseRepo.create(createCourseDto);
      return await this.courseRepo.save(course);
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async editCourse(
    id: string,
    editCourseDto: EditCourseDto,
  ): Promise<CourseEntity> {
    try {
      const thumbnail = editCourseDto.thumbnail;
      if (thumbnail) {
        await this.cloudinaryService.delete(thumbnail?.public_id);

        const response = await this.cloudinaryService.upload(thumbnail, {
          folder: 'courses',
        });
        editCourseDto.thumbnail = {
          public_id: response.public_id,
          url: response.secure_url,
        };
      }
      const course = await this.findCourseById(id);
      delete editCourseDto.courseData;
      const updatedCourse = this.courseRepo.merge(course, editCourseDto);
      return await this.courseRepo.save(updatedCourse);
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async getCourseForAll(id: string): Promise<CourseEntity> {
    try {
      const course = await this.findCourseById(id);
      const cachedCourse = await this.redisService.get(id);
      if (cachedCourse) {
        return JSON.parse(cachedCourse);
      }
      course.courseData.map((course) => {
        delete course.videoUrl;
        delete course.suggestion;
        delete course.questions;
        delete course.links;
      });
      await this.redisService.set(id, JSON.stringify(course));
      return course;
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async allCourses(): Promise<CourseEntity[]> {
    try {
      const courses = await this.courseRepo.find();
      const cached = await this.redisService.get('courses');
      if (cached) {
        return JSON.parse(cached);
      }
      courses.map((course) => {
        course.courseData.map((courseData) => {
          delete courseData.videoUrl;
          delete courseData.suggestion;
          delete courseData.questions;
          delete courseData.links;
        });
      });
      await this.redisService.set('courses', JSON.stringify(courses));
      return courses;
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async findCourseById(id: string): Promise<CourseEntity> {
    try {
      const course = await this.courseRepo.findOne({ id });
      if (!course) {
        throw new NotFoundException(`Course ${id} not found`);
      }
      return course;
    } catch (error) {
      this.errorException.throwError(error);
    }
  }
}
