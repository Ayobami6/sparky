import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { Message } from 'src/user/types';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationEntity } from './notification.entity';

@UseGuards(AdminAuthGuard)
@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all notifications',
    type: [NotificationEntity],
  })
  @ApiOperation({
    summary: 'Get all notifications',
    description: 'Get all notifications for the authenticated user',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getAllNotifications(): Promise<Message> {
    return await this.notificationService.getAllNotifications();
  }

  @Put('/read/:id')
  @ApiResponse({
    status: 200,
    description: 'Update notification status',
  })
  @ApiOperation({
    summary: 'Update notification status',
    description: 'Update notification status for the authenticated user',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async updateNotificationStatus(
    @Param('id') notificationId: string,
  ): Promise<Message> {
    return await this.notificationService.updateNotificationStatus(
      notificationId,
    );
  }
}
