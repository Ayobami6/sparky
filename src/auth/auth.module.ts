import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisService } from 'src/utils/redis.service';
import { redisClientFactory } from 'src/utils/redis.client.factory';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  exports: [],
  providers: [AuthService, RedisService, redisClientFactory],
})
export class AuthModule {}
