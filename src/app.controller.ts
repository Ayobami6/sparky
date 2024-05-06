import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { LoggerService } from './logger.service';
import { RedisService } from './utils/redis.service';
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
    await this.redisService.set('test', 'test');
    res.status(HttpStatus.OK).json(await this.redisService.get('test'));
  }
}
