import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddReviewDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 1000,
    description: 'The review content',
  })
  review: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: 'integer',
    minimum: 1,
    maximum: 5,
    description: 'The review rating',
  })
  rating: number;
}

export class ReviewReplyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    maxLength: 1000,
    description: 'The reply content',
  })
  reply: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'The review ID',
  })
  reviewId: string;
}
