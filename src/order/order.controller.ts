import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { Message } from 'src/user/types';

@UseGuards(AuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: UserEntity,
  ): Promise<Message> {
    return await this.orderService.createOrder(createOrderDto, user);
  }
}