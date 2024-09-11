import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  activationToken: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: 'integer',
    minimum: 1000,
    maximum: 9999,
    description: '4-digit code sent to your registered email address',
  })
  activation_code: number;
}
