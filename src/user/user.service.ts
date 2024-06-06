import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger.service';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-use.dto';
import * as bcrypt from 'bcrypt';
import { ActivationResponse, Avatar, Message, RoleEnum } from './types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import path from 'path';
import ejs from 'ejs';
import { EmailService } from 'src/utils/sendmail.service';
import { VerificationDto } from './dto/verification.dto';
import { v4 as uuid } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/utils/redis.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import cloudinary from 'cloudinary';
import { ErrorException } from 'src/utils/error-exceptions';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  private logger = new Logger();
  private userRepository;
  private errorException = new ErrorException();

  constructor(
    private loggerService: LoggerService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private redisService: RedisService,
    private cloudinaryService: CloudinaryService,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async createUser(createUserDto: CreateUserDto): Promise<Message> {
    try {
      const { name, email, password } = createUserDto;
      const userExist = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      if(userExist) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
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
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error)
      
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, userId: string): Promise<any> {
    try {
      const user = await this.findUserById(userId);
      const { name, avatar } = updateUserDto;
      if (user) {
        user.name = name;
        user.avatar = avatar;
        await this.userRepository.save(user);
        this.redisService.set(user.email, JSON.stringify(user), 604000);
        return {
          success: true,
          message: 'User updated successfully',
          user: user,
        };
      } else {
        throw new HttpException(
          {
            success: false,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
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

  async changePassword(
    userId: string,
    updatePasswordDto: ChangePasswordDto,
  ): Promise<Message> {
    try {
      const user = await this.findUserById(userId);
      const { oldPassword, newPassword } = updatePasswordDto;
      if (user && (await bcrypt.compare(oldPassword, user.password))) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        this.redisService.set(user.email, JSON.stringify(user), 604000);
        return {
          success: true,
          message: 'Password updated successfully',
        };
      } else {
        throw new HttpException('Incorrect Old password', 400);
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      this.loggerService.error(error.message, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong, Try again!',
      });
    }
  }

  async changeAvatar(userId: string, avatar: string): Promise<Message> {
    try {
      if (!avatar) {
        throw new HttpException('Avatar is required', 400);
      }
      const user = await this.findUserById(userId);
      if (user) {
        if (user?.avatar?.publicUrl) {
          // delete from cloudinary
          await this.cloudinaryService.delete(user?.avatar?.publicUrl);
        } else {
          const upload = this.cloudinaryService.upload(avatar, {
            folder: 'avatars',
            width: 150,
          });
          user.avatar = {
            publicUrl: (await upload).public_id,
            url: (await upload).secure_url,
          };
          await this.userRepository.save(user);
          this.redisService.set(user.email, JSON.stringify(user), 604000);
          return {
            success: true,
            message: 'Avatar updated successfully',
            user: user,
          };
        }
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        this.logger.error(error.message, error.stack);
        this.loggerService.error(error.message, error);
        throw new InternalServerErrorException({
          success: false,
          message: 'Something went wrong, Try again!',
        });
      }
      // this.errorException.throwError(error);
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
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error)
    }
  }

  async findUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(): Promise<Message> {
    try {
      // get users from redis first
      const users = await this.redisService.get('users');
      if (users) {
        return {
          success: true,
          data: JSON.parse(users),
        };
      } else {
        const users = await this.userRepository.find({
          order: {
            createdAt: 'DESC',
          },
        });
        // save to redis
        this.redisService.set('users', JSON.stringify(users), 604000);
        return {
          success: true,
          data: users,
        };
      }
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }

  // admin update user role
  async updateUserRole(userId: string, role: RoleEnum): Promise<Message> {
    try {
      const user = await this.findUserById(userId);
      if (user) {
        user.role = role;
        await this.userRepository.save(user);
        this.redisService.set(user.email, JSON.stringify(user), 604000);
        return {
          success: true,
          message: 'User role updated successfully',
          user: user,
        };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }

  // delete user
  async deleteUser(userId: string): Promise<Message> {
    try {
      const user = await this.findUserById(userId);
      if (user) {
        if (user?.avatar?.publicUrl) {
          // delete from cloudinary
          await this.cloudinaryService.delete(user?.avatar?.publicUrl);
        }
        await this.userRepository.delete(user);
        this.redisService.del(user.email);
        return {
          success: true,
          message: 'User deleted successfully',
        };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      this.loggerService.error(error.message, error);
      this.errorException.throwError(error);
    }
  }
}
