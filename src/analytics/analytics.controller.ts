import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { Message } from 'src/user/types';

@UseGuards(AdminAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(@Query('category') category: string): Promise<Message> {
    return await this.analyticsService.getAnalytics(category);
  }
}
