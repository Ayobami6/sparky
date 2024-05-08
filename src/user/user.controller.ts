import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user-info')
  async getUserInfo(@GetUser() user: any): Promise<UserEntity> {
    return await this.userService.findUserById(user.id);
  }

  @Post('user-update')
  async updateUser(
    @GetUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUser(updateUserDto, user.id);
  }
}
