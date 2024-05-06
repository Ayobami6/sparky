import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-use.dto';
import * as bcrypt from 'bcrypt';
import { ActivationResponse, Message } from './types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import path from 'path';
import ejs from 'ejs';
import { EmailService } from 'src/utils/sendmail.service';

@Injectable()
export class UserService {
  private logger = new Logger();
  private userRepository;

  constructor(
    private loggerService: LoggerService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async createUser(createUserDto: CreateUserDto): Promise<Message> {
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
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, '../mails/activation-mail.ejs'),
        data,
      );
      try {
        this.emailService.sendEmail(
          user.email,
          'Activate your account',
          'activation-mail.ejs',
          data,
        );
        return {
          success: true,
          message: `Activation has been sent to your email ${user.email}`,
        };
      } catch (err) {
        this.logger.error(err.message, err.stack);
        this.loggerService.error(err.message, err);
        return {
          success: false,
          message: 'Unable to send message',
        };
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      this.loggerService.error(error.message, error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong, Try again!',
      });
    }
  }
  createActivationToken(user: UserEntity): ActivationResponse {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
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
