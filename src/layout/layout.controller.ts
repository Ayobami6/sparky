import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { Message } from 'src/user/types';

@Controller('layout')
export class LayoutController {
  constructor(private layoutService: LayoutService) {}

  @UseGuards(AdminAuthGuard)
  @Post('create')
  async createLayout(
    @Body() createLayoutDto: CreateLayoutDto,
  ): Promise<Message> {
    return await this.layoutService.createLayout(createLayoutDto);
  }

  @UseGuards(AdminAuthGuard)
  @Put('edit')
  async editLayout(@Body() createLayoutDto: CreateLayoutDto): Promise<Message> {
    return await this.layoutService.editLayout(createLayoutDto);
  }

  @Get()
  async getLayoutByType(@Body() typeBody: any): Promise<Message> {
    const { type } = typeBody;
    const layout = await this.layoutService.findLayoutByType(type);
    return {
      success: true,
      data: layout,
    };
  }
}