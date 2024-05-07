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
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
    });
  }
  //   validate
  async validate(payload: JwtPayload): Promise<UserEntity> {
    try {
      const { email } = payload;
      const user = await this.dataSource
        .getRepository(UserEntity)
        .findOne({ where: { email: email } });
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      this.loggerService.error(error.message, error);
      throw new InternalServerErrorException();
    }
  }
}
