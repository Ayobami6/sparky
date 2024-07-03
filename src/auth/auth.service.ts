import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './interfaces/login-response';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/logger.service';
import { RedisService } from 'src/utils/redis.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { SocialAuthDto } from 'src/user/dto/create-use.dto';
import { RoleEnum } from 'src/user/types';
import { v4 as uuid } from 'uuid';
import { ErrorException } from 'src/utils/error-exceptions';

@Injectable()
export class AuthService {
  private userRepository;
  private logger = new Logger();
  private errorExceptions = new ErrorException();
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
    private loggerService: LoggerService,
    private readonly redisService: RedisService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const { email, password } = loginUserDto;
      // find the user
      const user = await this.userRepository.findOne({ email: email });
      if (user && (await bcrypt.compare(password, user.password))) {
        delete user.password;
        delete user._id;
        this.redisService.set(user.email, JSON.stringify(user), 604000);
        const { accessToken, refreshToken } = this.generateTokens(
          email,
          user.id,
        );
        return {
          refreshToken,
          accessToken,
          user,
        };
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorExceptions.throwError(error);
    }
  }

  async socialAuth(socialAuthDto: SocialAuthDto): Promise<LoginResponse> {
    try {
      const { email, name, avatar } = socialAuthDto;
      const user = await this.userRepository.findOne({ email: email });
      if (!user) {
        const user = await this.userRepository.create({
          name,
          email,
          avatar,
          role: RoleEnum.user,
          isVerified: false,
          id: uuid(),
        });
        this.userRepository.save(user);
        this.redisService.set(user.email, JSON.stringify(user));
        const { accessToken, refreshToken } = this.generateTokens(
          email,
          user.id,
        );
        return {
          refreshToken,
          accessToken,
          user,
        };
      }
      this.redisService.set(user.email, JSON.stringify(user), 604000);
      const { accessToken, refreshToken } = this.generateTokens(email, user.id);
      return {
        refreshToken,
        accessToken,
        user,
      };
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.logger.error(error.message, error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private generateTokens(email: string, userId: any): LoginResponse {
    const accessToken = this.jwtService.sign({ email });
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        expiresIn: '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const userInfo = this.jwtService.verify(refreshToken);
    const { userId } = userInfo;
    const user = await this.userService.findUserById(userId);
    return this.generateTokens(user.email, user.id);
  }
}
