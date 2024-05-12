import { Module } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { LayoutController } from './layout.controller';
import { LoggerService } from 'src/logger.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  providers: [LayoutService, LoggerService, CloudinaryService],
  controllers: [LayoutController],
})
export class LayoutModule {}
