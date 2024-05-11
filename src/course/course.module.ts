import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { RedisService } from 'src/utils/redis.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { LoggerService } from 'src/logger.service';
import { redisClientFactory } from 'src/utils/redis.client.factory';
import { EmailService } from 'src/utils/sendmail.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [CourseController],
  providers: [
    CourseService,
    RedisService,
    LoggerService,
    redisClientFactory,
    EmailService,
  ],
})
export class CourseModule {}
