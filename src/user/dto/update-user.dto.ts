import { IsOptional, IsString } from 'class-validator';
import { Avatar } from '../types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  avatar: Avatar;
}
