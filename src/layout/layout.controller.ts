import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { Message } from 'src/user/types';

@UseGuards(AdminAuthGuard)
@Controller('layout')
export class LayoutController {
  constructor(private layoutService: LayoutService) {}

  @Post('create')
  async createLayout(
    @Body() createLayoutDto: CreateLayoutDto,
  ): Promise<Message> {
    return await this.layoutService.createLayout(createLayoutDto);
  }

  @Put('edit')
  async editLayout(@Body() createLayoutDto: CreateLayoutDto): Promise<Message> {
    return await this.layoutService.editLayout(createLayoutDto);
  }
}
