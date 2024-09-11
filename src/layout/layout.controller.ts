import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { Message } from 'src/user/types';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LayoutEntity } from './layout.entity';

@ApiTags('layouts')
@Controller('layouts')
@ApiBearerAuth('JWT-auth')
export class LayoutController {
  constructor(private layoutService: LayoutService) {}

  @UseGuards(AdminAuthGuard)
  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Create a new layout',
    type: LayoutEntity,
  })
  @ApiOperation({
    summary: 'Create a new layout',
    description: 'Create a new layout',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async createLayout(
    @Body() createLayoutDto: CreateLayoutDto,
  ): Promise<Message> {
    return await this.layoutService.createLayout(createLayoutDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get layout by type',
    description: 'Get layout by type',
  })
  @ApiResponse({
    status: 200,
    description: 'Get layout by type',
    type: LayoutEntity,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Put('edit')
  async editLayout(@Body() createLayoutDto: CreateLayoutDto): Promise<Message> {
    return await this.layoutService.editLayout(createLayoutDto);
  }

  @Get()
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 200,
    description: 'Get layout by type',
    type: LayoutEntity,
  })
  @ApiOperation({
    summary: 'Get layout by type',
    description: 'Get layout by type',
  })
  async getLayoutByType(@Body() typeBody: any): Promise<Message> {
    const { type } = typeBody;
    const layout = await this.layoutService.findLayoutByType(type);
    return {
      success: true,
      data: layout,
    };
  }
}
