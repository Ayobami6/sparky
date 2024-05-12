import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Message } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user-info')
  async getUserInfo(@GetUser() user: any): Promise<UserEntity> {
    return await this.userService.findUserById(user.id);
  }

  @Put('user-update')
  async updateUser(
    @GetUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUser(updateUserDto, user.id);
  }

  @Put('change-password')
  async changePassword(
    @GetUser() user: UserEntity,
    @Body() updatePasswordDto: ChangePasswordDto,
  ): Promise<Message> {
    return await this.userService.changePassword(user.id, updatePasswordDto);
  }
  @Put('change-avatar')
  // @UseInterceptors(FileInterceptor('file'))
  async changeAvatar(
    @GetUser() user: UserEntity,
    @Body() avatarBody: any,
  ): Promise<Message> {
    const { avatar } = avatarBody;
    return await this.userService.changeAvatar(user.id, avatar);
  }

  @UseGuards(AdminAuthGuard)
  @Get('all')
  async getAllUsers(): Promise<Message> {
    return await this.userService.getAllUsers();
  }
}
