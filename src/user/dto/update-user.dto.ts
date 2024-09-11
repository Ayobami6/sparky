import { IsOptional, IsString } from 'class-validator';
import { Avatar } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'John Smith',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    type: 'object',
    example: {
      publicUrl: 'https://example.com/avatar.jpg',
      url: '/avatar.jpg',
    },
  })
  avatar: Avatar;
}
