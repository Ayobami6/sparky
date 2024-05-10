import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  contentId: string;
}
