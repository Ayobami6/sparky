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

export class QuestionReplyDto {
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsString()
  contentId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;
}
