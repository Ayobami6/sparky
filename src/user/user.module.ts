import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from 'src/logger.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from 'src/datasource/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from 'src/utils/sendmail.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET'),
          sigOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
  ],
  providers: [UserService, LoggerService, EmailService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService, LoggerService, PassportModule, JwtModule, JwtStrategy],
})
export class UserModule {}