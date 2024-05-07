import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-use.dto';
import * as bcrypt from 'bcrypt';
import { ActivationResponse, Message, RoleEnum } from './types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import path from 'path';
import ejs from 'ejs';
import { EmailService } from 'src/utils/sendmail.service';
import { VerificationDto } from './dto/verification.dto';
import { v4 as uuid } from 'uuid';

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
      const user = {
        name,
        email,
        password: hashedPassword,
      };
      const activationToken = this.createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, '../utils/mails/activation-mail.ejs'),
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
          activationToken: activationToken.token,
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
  createActivationToken(user: any): ActivationResponse {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        expiresIn: '10m',
      },
    );
    return {
      token,
      activationCode,
    };
  }

  async verifyActivationCode(verificationDto: VerificationDto): Promise<any> {
    try {
      const { activation_code, activationToken } = verificationDto;
      const verifyUser = this.jwtService.verify(activationToken);
      console.log(verifyUser.activationCode, activation_code);
      if (Number(verifyUser.activationCode) !== Number(activation_code)) {
        throw new UnauthorizedException('Invalid activation code');
      }
      const { email, password, name } = verifyUser.user;
      const existUser = await this.userRepository.findOne({ email: email });
      console.log(existUser);
      if (existUser) {
        throw new UnauthorizedException('User already exist');
      }
      const user = await this.userRepository.create({
        name,
        email,
        password,
        role: RoleEnum.user,
        isVerified: false,
        id: uuid(),
      });
      const savedUser = await this.userRepository.save(user);
      return {
        success: true,
        message: 'User created successfully',
        user: savedUser,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      this.loggerService.error(error.message, error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong, Try again!',
      });
    }
  }

  async findUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
