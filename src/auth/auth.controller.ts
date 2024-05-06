import { Body, Controller, Post, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-use.dto';
import { Message } from 'src/user/types';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post('register')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Message> {
    const message = await this.userService.createUser(createUserDto);
    return message;
  }
}
