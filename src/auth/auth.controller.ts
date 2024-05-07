import { Body, Controller, Post, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-use.dto';
import { VerificationDto } from 'src/user/dto/verification.dto';
import { Message } from 'src/user/types';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './interfaces/login-response';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Version('1')
  @Post('register')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Message> {
    const message = await this.userService.createUser(createUserDto);
    return message;
  }

  @Version('1')
  @Post('verify')
  async verify(@Body() verificationDto: VerificationDto): Promise<UserEntity> {
    try {
      return await this.userService.verifyActivationCode(verificationDto);
    } catch (error) {
      throw error;
    }
  }

  @Version('1')
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const loginResponse = await this.authService.loginUser(loginUserDto);
    return loginResponse;
  }
}
