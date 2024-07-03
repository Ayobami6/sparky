import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateVideoUrlDto {
  @IsNotEmpty()
  @IsString()
  videoId: string;
}
