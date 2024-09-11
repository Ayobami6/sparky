import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Message } from './types';
import { AdminAuthGuard } from 'src/auth/jwt-admin-authguard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user-info')
  @ApiResponse({
    status: 200,
    description: 'Get current user information',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiOperation({
    summary: 'Get current user information',
  })
  async getUserInfo(@GetUser() user: any): Promise<UserEntity> {
    return await this.userService.findUserById(user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update user information',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiOperation({
    summary: 'Update user information',
  })
  @Put('user-update')
  async updateUser(
    @GetUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUser(updateUserDto, user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Change user password',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change user password with old and new password',
  })
  @Put('change-password')
  async changePassword(
    @GetUser() user: UserEntity,
    @Body() updatePasswordDto: ChangePasswordDto,
  ): Promise<Message> {
    return await this.userService.changePassword(user.id, updatePasswordDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Change user avatar',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiOperation({
    summary: 'Change user avatar',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Get all users',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getAllUsers(): Promise<Message> {
    return await this.userService.getAllUsers();
  }

  @UseGuards(AdminAuthGuard)
  @Put('update-role')
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiOperation({
    summary: 'Update user role',
    description: 'Update user role by user id',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 200,
    description: 'Update user role',
  })
  async updateUserRole(
    @Body() updateRoleDto: UpdateUserRoleDto,
  ): Promise<Message> {
    const { role, userId } = updateRoleDto;
    return await this.userService.updateUserRole(userId, role);
  }

  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Data Provided',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user by user id',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete user',
  })
  @UseGuards(AdminAuthGuard)
  @Delete('delete/:userId')
  async deleteUser(@Param('userId') userId: string): Promise<Message> {
    return await this.userService.deleteUser(userId);
  }
}
