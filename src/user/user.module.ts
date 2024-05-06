import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from 'src/logger.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  providers: [UserService, LoggerService],
  controllers: [UserController],
  exports: [UserService, LoggerService],
})
export class UserModule {}
