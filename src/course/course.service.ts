import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { UserEntity } from 'src/user/user.entity';
import { Message } from 'src/user/types';
import { QuestionDto, QuestionReplyDto } from './dto/add-question.dto';
import { Question } from './course-types';
import ejs from 'ejs';
import path from 'path';
import { EmailService } from 'src/utils/sendmail.service';
import { AddReviewDTO, ReviewReplyDto } from './dto/add-review.dto';
import { title } from 'process';

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
    private emailService: EmailService,
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

  async getCourse(courseId: string, user: UserEntity): Promise<Message> {
    try {
      const userCourses = user.courses;
      if (!userCourses)
        throw new NotFoundException(`You've not enrolled in this course`);
      if (userCourses.includes(courseId)) {
        const course = await this.findCourseById(courseId);
        return {
          success: true,
          data: course.courseData,
        };
      } else {
        throw new NotFoundException(`You've not enrolled in this course`);
      }
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async addQuestion(
    questionDto: QuestionDto,
    user: UserEntity,
  ): Promise<Message> {
    try {
      const { courseId, question, contentId } = questionDto;
      const course = await this.findCourseById(courseId);
      course.courseData.map((courseData) => {
        if (courseData.id === contentId) {
          const questionObj: Question = {
            user,
            text: question,
            replies: [],
            id: uuid(),
          };
          if (!courseData.questions) {
            courseData.questions = [];
          }
          courseData.questions.push(questionObj);
        }
      });
      await this.courseRepo.save(course);
      return {
        success: true,
        data: course,
      };
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async replyQuestion(
    questionReplyDto: QuestionReplyDto,
    user: UserEntity,
  ): Promise<Message> {
    try {
      const { courseId, questionId, reply, contentId } = questionReplyDto;
      const course = await this.findCourseById(courseId);
      const courseContent = course.courseData.find(
        (courseData) => courseData.id === contentId,
      );
      if (!courseContent) {
        throw new NotFoundException(`Content not found`);
      }
      const question = courseContent.questions.find(
        (question) => question.id === questionId,
      );
      if (!question) {
        throw new NotFoundException(`Question not found`);
      }
      const replyObj = {
        user,
        text: reply,
        id: uuid(),
      };
      question.replies.push(replyObj);
      await this.courseRepo.save(course);
      if (user.id === question.user.id) {
        // create a notification
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, '../utils/mails/reply.ejs'),
          data,
        );
        try {
          await this.emailService.sendEmail(
            question.user.email,
            'Reply to your question',
            'reply.ejs',
            data,
          );
        } catch (error) {
          this.errorException.throwError(error);
        }
      }
      return {
        success: true,
        data: course,
      };
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  // add review to course if eligible
  async addReview(
    user: UserEntity,
    addReviewDto: AddReviewDTO,
    courseId: string,
  ): Promise<Message> {
    try {
      const { rating, review } = addReviewDto;
      const userCourses = user.courses;
      if (userCourses.includes(courseId)) {
        const course = await this.findCourseById(courseId);
        if (!course.reviews) {
          course.reviews = [];
        }
        course.reviews.push({
          user,
          text: review,
          rating,
          id: uuid(),
          replies: [],
        });
        let total = 0;
        course.reviews.map((review) => {
          total += review.rating;
        });
        course.ratings = total / course.reviews.length;
        await this.courseRepo.save(course);
        // add notification
        const notification = {
          title: 'New Course Review Received',
          message: `${user.name} has given a review on ${course.name}`,
        };
        // send the notification
        return {
          success: true,
          data: course,
        };
      } else {
        throw new UnauthorizedException(
          'You are eligible to access this course',
        );
      }
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async addReplyToReview(
    user: UserEntity,
    reviewReplyDto: ReviewReplyDto,
    courseId,
  ): Promise<Message> {
    try {
      const { reviewId, reply } = reviewReplyDto;
      const course = await this.findCourseById(courseId);
      const review = course.reviews.find((review) => review.id === reviewId);
      if (!review) {
        throw new NotFoundException(`Review not found`);
      }
      const replyObj = {
        user,
        text: reply,
        id: uuid(),
      };
      review.replies.push(replyObj);
      await this.courseRepo.save(course);
      return {
        success: true,
        data: course,
      };
    } catch (error) {
      this.errorException.throwError(error);
    }
  }
}
