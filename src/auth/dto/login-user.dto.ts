import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password is too weak' },
  )
  @ApiProperty({
    type: 'string',
    format: 'password',
  })
  password: string;
}
