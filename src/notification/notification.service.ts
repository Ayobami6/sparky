import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { ErrorException } from 'src/utils/error-exceptions';
import { DataSource } from 'typeorm';
import { NotificationEntity, Status } from './notification.entity';
import { Message } from 'src/user/types';
import { NotificationStatusDto } from './dto/notification-status.dto';

@Injectable()
export class NotificationService {
  private errorException = new ErrorException();
  private notificationRepo;

  constructor(
    private dataSource: DataSource,
    private loggerService: LoggerService,
  ) {
    this.notificationRepo = this.dataSource.getRepository(NotificationEntity);
  }

  async getAllNotifications(): Promise<Message> {
    try {
      const notifications = await this.notificationRepo.find({
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async updateNotificationStatus(notificationId: string): Promise<Message> {
    /**
     * Updates Notification Status to Read
     */
    try {
      const notification = await this.findNotificationById(notificationId);
      notification.status = Status.READ;
      await this.notificationRepo.save(notification);
      const notifications = await this.getAllNotifications();
      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      this.errorException.throwError(error);
    }
  }

  async findNotificationById(id: string): Promise<NotificationEntity> {
    try {
      const notification = await this.notificationRepo.findOne({
        where: { id: id },
      });
      if (!notification)
        throw new NotFoundException(`Notification ${id} not found`);
      return notification;
    } catch (error) {
      this.errorException.throwError(error);
    }
  }
}
