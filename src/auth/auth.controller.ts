import { Body, Controller, Inject, Post, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto, SocialAuthDto } from 'src/user/dto/create-use.dto';
import { VerificationDto } from 'src/user/dto/verification.dto';
import { Message } from 'src/user/types';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './interfaces/login-response';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Version('1')
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: () => CreateUserDto,
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  @ApiOperation({
    summary: 'Register new user',
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<Message> {
    const message = await this.userService.createUser(createUserDto);
    return message;
  }

  @Version('1')
  @Post('verify')
  @ApiResponse({
    status: 200,
    description: 'User verified successfully',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: () => VerificationDto,
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  @ApiOperation({
    summary: 'Verify user account',
  })
  async verify(@Body() verificationDto: VerificationDto): Promise<UserEntity> {
    try {
      return await this.userService.verifyActivationCode(verificationDto);
    } catch (error) {
      throw error;
    }
  }

  @Version('1')
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Returns JWT tokens for authenticated users',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: () => LoginUserDto,
    status: 400,
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<any> {
    const loginResponse = await this.authService.loginUser(loginUserDto);
    const { accessToken, refreshToken, user } = loginResponse;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh_token',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/auth/login',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({
      success: true,
      message: 'Login Successful',
      accessToken,
      refreshToken,
      user,
    });
  }

  @Post('refresh')
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: () => LoginUserDto,
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  @ApiResponse({
    status: 200,
    description: 'User token refreshed successfully',
  })
  @ApiOperation({
    summary: 'Refresh user token',
    description: 'Returns new JWT tokens for authenticated users',
  })
  async refreshToken(@Body() body: any): Promise<LoginResponse> {
    const { refreshToken } = body;
    return await this.authService.refreshToken(refreshToken);
  }

  @Post('social-auth')
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: () => SocialAuthDto,
    status: 400,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    status: 500,
  })
  @ApiOperation({
    summary: 'Social Auth',
    description: 'Social Authenticate user',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  async socialAuth(
    @Body() socialAuthDto: SocialAuthDto,
  ): Promise<LoginResponse> {
    return this.authService.socialAuth(socialAuthDto);
  }
}
