import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddReviewDTO {
  @IsNotEmpty()
  @IsString()
  review: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}

export class ReviewReplyDto {
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNotEmpty()
  @IsString()
  reviewId: string;
}
