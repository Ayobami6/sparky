import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-use.dto';
import * as bcrypt from 'bcrypt';
import { ActivationResponse } from './types';
import jwt from 'jwtwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private logger = new Logger();
  private userRepository;

  constructor(
    private loggerService: LoggerService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async createUser(createUserDto: CreateUserDto): Promise<ActivationResponse> {
    try {
      const { name, email, password } = createUserDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      const activationToken = this.createActivationToken(user);
      return activationToken;
    } catch (error) {
      this.loggerService.error(error.message, error);
    }
  }

  createActivationToken(user: UserEntity): ActivationResponse {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
      {
        user,
        activationCode,
      },
      this.configService.get('JWT_SECRE'),
      {
        expiresIn: '5m',
      },
    );
    return {
      token,
      activationCode,
    };
  }
}
