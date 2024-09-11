import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'What is the capital of France?',
    description: 'The question to be answered',
  })
  question: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'some id',
    description: 'course id',
  })
  courseId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'some id',
    description: 'content id',
  })
  contentId: string;
}

export class QuestionReplyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'The capital of France is Paris',
    description: 'The answer to the question',
  })
  reply: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'some id',
    description: 'question id',
  })
  questionId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'some id',
    description: 'content id',
  })
  contentId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'some id',
    description: 'course id',
  })
  courseId: string;
}
