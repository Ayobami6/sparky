import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './interfaces/login-response';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/logger.service';

@Injectable()
export class AuthService {
  private userRepository;
  private logger = new Logger();
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
    private loggerService: LoggerService,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    try {
      const { email, password } = loginUserDto;
      // find the user
      const user = await this.userRepository.findOne({ email: email });
      if (user && (await bcrypt.compare(password, user.password))) {
        return this.generateTokens(email);
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.logger.error(error.message, error.stack);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private generateTokens(email: string): LoginResponse {
    const accessToken = this.jwtService.sign({ email });
    const refreshToken = this.jwtService.sign(
      { email },
      { expiresIn: '7days' },
    );
    return { accessToken, refreshToken };
  }
}
