import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { Message } from 'src/user/types';

@UseGuards(AdminAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('all')
  getAllNotifications(): Promise<Message> {
    return this.notificationService.getAllNotifications();
  }
}
