import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
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

@UseGuards(AdminAuthGuard)
@Controller('analytics')
@ApiTags('analytics')
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get analytics based on category',
    description: 'Get analytics data for a specific category.',
  })
  @ApiResponse({
    status: 200,
    description: 'Get analytics data for a specific category',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request: category is required',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAnalytics(@Query('category') category: string): Promise<Message> {
    return await this.analyticsService.getAnalytics(category);
  }
}
