import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Avatar } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'John Doe',
  })
  name: string;

  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password is too weak' },
  )
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'john.doe@example.com',
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    type: 'object',
    example: { publicUrl: 'https://example.com/avatar.jpg', url: 'avatar.jpg' },
  })
  avatar: Avatar;
}

export class SocialAuthDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'John Doe',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    type: 'object',
    example: { publicUrl: 'https://example.com/avatar.jpg', url: 'avatar.jpg' },
  })
  avatar: Avatar;
}
