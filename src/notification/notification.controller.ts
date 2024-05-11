import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { Message } from 'src/user/types';

@UseGuards(AdminAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('all')
  async getAllNotifications(): Promise<Message> {
    return await this.notificationService.getAllNotifications();
  }

  @Put('/read/:id')
  async updateNotificationStatus(
    @Param('id') notificationId: string,
  ): Promise<Message> {
    return await this.notificationService.updateNotificationStatus(
      notificationId,
    );
  }
}
