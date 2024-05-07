import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsString()
  activationToken: string;

  @IsNotEmpty()
  @IsNumber()
  activation_code: number;
}
