import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CourseService } from 'src/course/course.service';

@Module({
  imports: [UserModule],
  providers: [OrderService, CloudinaryService, CourseService],
  controllers: [OrderController],
})
export class OrderModule {}
