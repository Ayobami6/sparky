import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  courseId: string;

  @IsOptional()
  @ApiProperty({
    type: 'object',
    example: {
      cardNumber: '1234567890123456',
      expiryDate: '12/24',
      cvv: '123',
    },
    description: 'Payment information',
  })
  payment_info: object;
}
