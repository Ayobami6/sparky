import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Avatar } from '../types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password is too weak' },
  )
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  avatar: Avatar;
}

export class SocialAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  avatar: Avatar;
}
