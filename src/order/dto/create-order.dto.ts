import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  payment_info: object;
}
