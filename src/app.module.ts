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
import { AuthModule } from './auth/auth.module';
import { EmailService } from './utils/sendmail.service';
import { AuthService } from './auth/auth.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.MACHINE}`],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [
    AppService,
    redisClientFactory,
    RedisService,
    LoggerService,
    UserService,
    EmailService,
    AuthService,
    CloudinaryService,
  ],
})
export class AppModule {}
