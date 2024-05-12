import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from '../types';

export class UpdateUserRoleDto {
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
