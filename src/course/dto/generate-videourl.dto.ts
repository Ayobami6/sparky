import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateVideoUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier for the video.',
  })
  videoId: string;
}
