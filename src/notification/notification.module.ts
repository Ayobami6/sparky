import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { LoggerService } from 'src/logger.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  providers: [NotificationService, LoggerService, CloudinaryService],
  controllers: [NotificationController],
})
export class NotificationModule {}
