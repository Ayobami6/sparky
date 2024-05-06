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
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.MACHINE}`],
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, redisClientFactory, RedisService, LoggerService, UserService],
})
export class AppModule {}
