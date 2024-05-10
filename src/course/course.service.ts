import { Injectable } from '@nestjs/common';
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
          secure_url: response.secure_url,
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
}
