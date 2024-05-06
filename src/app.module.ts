import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from './datasource/typeorm.module';
import { redisClientFactory } from './utils/redis.client.factory';
import { RedisService } from './utils/redis.service';
import { LoggerService } from './logger.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.MACHINE}`],
      isGlobal: true,
    }),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, redisClientFactory, RedisService, LoggerService],
})
export class AppModule {}
