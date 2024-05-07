import {
  Controller,
  Get,
  HttpStatus,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoggerService } from './logger.service';
import { RedisService } from './utils/redis.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './user/user.entity';
import { GetUser } from './auth/get-user.decorator';
import { AdminAuthGuard } from './auth/jwt-admin-authguard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  testServer(@Res() res: Response): any {
    res.status(HttpStatus.OK).json(this.appService.testServer());
  }

  @Get('set')
  async testRedis(@Res() res: Response): Promise<any> {
    try {
      await this.redisService.set('test', 'test');
      res.status(HttpStatus.OK).json(await this.redisService.get('test'));
    } catch (error) {
      this.loggerService.error(error.message, error.stack);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
  @Get('userinfo')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@GetUser() user: any): Promise<UserEntity> {
    try {
      return user;
    } catch (error) {
      console.log(error.code);
      console.log(error);
      this.loggerService.error(error.message, error.stack);
      throw new UnauthorizedException();
    }
  }
}
