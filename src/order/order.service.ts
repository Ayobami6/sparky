import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { DataSource } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CourseEntity } from 'src/course/course.entity';
import { UserEntity } from 'src/user/user.entity';
import path from 'path';
import ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/utils/redis.service';
import { EmailService } from 'src/utils/sendmail.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationEntity } from 'src/notification/notification.entity';
import { ErrorException } from 'src/utils/error-exceptions';
import { CreateOrderDto } from './dto/create-order.dto';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';
import { Message } from 'src/user/types';

@Injectable()
export class OrderService {
  private orderRepository;
  private courseRepo;
  private userRepo;
  private notificationRepo;
  private errorException = new ErrorException();
  constructor(
    private dataSource: DataSource,
    private loggerService: LoggerService,
    private emailService: EmailService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    private redisService: RedisService,
    private courseService: CourseService,
    private userService: UserService,
  ) {
    this.orderRepository = this.dataSource.getRepository(OrderEntity);
    this.courseRepo = this.dataSource.getRepository(CourseEntity);
    this.userRepo = this.dataSource.getRepository(UserEntity);
    this.notificationRepo = this.dataSource.getRepository(NotificationEntity);
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: UserEntity,
  ): Promise<Message> {
    try {
      const { courseId, payment_info } = createOrderDto;
      let userCourses = user.courses;
      if (!userCourses) userCourses = [];
      if (userCourses.includes(courseId)) {
        throw new HttpException(
          'You Already Purchased this course',
          HttpStatus.BAD_REQUEST,
        );
      }
      //   find the course
      const course = await this.courseService.findCourseById(courseId);
      if (!course) throw new NotFoundException('Course not found');
      //   create the order
      const data = {
        userId: user.id,
        courseId,
        payment_info,
      };
      const order = await this.orderRepository.create(data);
      const orderCreated = await this.orderRepository.save(order);
      //   send mail
      const mailData = {
        order: {
          id: orderCreated.id,
          username: user.name,
          courseName: course.name,
          courseId: orderCreated.courseId,
          price: course.price,
          date: orderCreated.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
        username: user.name,
      };

      const email = user.email;
      const subject = 'Order Confirmation';
      const html = await ejs.renderFile(
        path.join(__dirname, '../utils/mails/order-confirmation.ejs'),
        mailData,
      );
      try {
        await this.emailService.sendEmail(
          email,
          subject,
          'order-confirmation.ejs',
          mailData,
        );
      } catch (error) {
        throw new HttpException(
          'Error sending order confirmation Email',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }
      const userInstance = await this.userService.findUserById(user.id);
      if (!userInstance.courses) userInstance.courses = [];
      userInstance.courses.push(courseId);
      await this.userRepo.save(userInstance);

      const notification = await this.notificationRepo.create({
        userId: user.id,
        title: 'New Course Order',
        message: `You have new order for ${course.name}`,
      });
      await this.notificationRepo.save(notification);
      if (course.purchased) {
        course.purchased += 1;
      } else {
        course.purchased = 1;
      }
      await this.courseRepo.save(course);
      return {
        success: true,
        data: orderCreated,
      };
    } catch (error) {
      this.errorException.throwError(error);
    }
  }
}
