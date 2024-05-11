import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { ErrorException } from 'src/utils/error-exceptions';
import { DataSource } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { Message } from 'src/user/types';

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
}
