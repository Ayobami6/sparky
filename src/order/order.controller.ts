import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { Message } from 'src/user/types';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderEntity } from './order.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'Order created successfully.',
    type: OrderEntity,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided.',
  })
  @ApiOperation({
    summary: 'Create a new order.',
    description: 'Create a new order for a user.',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.orderService.createOrder(createOrderDto, user);
  }

  @UseGuards(AdminAuthGuard)
  @Get('all')
  @ApiOperation({
    summary: 'Get all orders.',
    description: 'Get all orders for an admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
    type: [OrderEntity],
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided.',
  })
  async getAllOrders(): Promise<Message> {
    return await this.orderService.getAllOrders();
  }
}
