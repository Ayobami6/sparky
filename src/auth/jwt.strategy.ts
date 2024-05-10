import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger.service';
import { UserEntity } from 'src/user/user.entity';
import { JwtPayload } from './interfaces/jwt.interface';
import { RedisService } from 'src/utils/redis.service';

interface UserResponse {
  id: number;
  username: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //   Dependency Injection
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    private configService: ConfigService,
    private loggerService: LoggerService,
    private redisService: RedisService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }
  //   validate
  async validate(payload: JwtPayload): Promise<any> {
    try {
      const { email } = payload;
      const user = await this.redisService.get(email);
      if (!user) {
        throw new UnauthorizedException();
      }
      const parsedUser = JSON.parse(user);
      const userObj = {
        id: parsedUser.id,
        email: parsedUser.email,
        name: parsedUser.name,
        avatar: parsedUser.avatar,
        isVerified: parsedUser.isVerified,
        courses: parsedUser.courses,
        createdAt: parsedUser.createdAt,
        role: parsedUser.role,
      };
      return userObj;
    } catch (error) {
      this.loggerService.error(error.message, error);
      console.log(error.status);
      if (error.status === 401) throw new UnauthorizedException();
      else throw new InternalServerErrorException();
    }
  }
}
