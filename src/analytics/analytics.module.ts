import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { LoggerService } from 'src/logger.service';

@Module({
  providers: [AnalyticsService, LoggerService],
  controllers: [AnalyticsController]
})
export class AnalyticsModule {}
