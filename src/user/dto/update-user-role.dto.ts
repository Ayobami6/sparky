import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    enum: RoleEnum,
    enumName: 'RoleEnum',
  })
  role: RoleEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  userId: string;
}
