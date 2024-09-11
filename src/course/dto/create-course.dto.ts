import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Benefit,
  Course,
  CourseContent,
  Instructor,
  Review,
  Thumbnail,
} from '../course-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto implements Course {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Introduction to JavaScript',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example:
      'Learn the basics of JavaScript, including syntax, data types, and control structures.',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    example: 100,
  })
  price: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    type: 'number',
    example: 150,
  })
  estimatedPrice: number;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'some id',
  })
  id: string;

  @IsOptional()
  @ApiProperty({
    type: 'object',
    example: { public_id: 'some_id', url: 'https://example.com/thumbnail.jpg' },
  })
  thumbnail?: Thumbnail;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Beginner',
  })
  level: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: 'string',
    example: ['HTML', 'CSS', 'JavaScript'],
  })
  tags: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'https://example.com/demo.mp4',
  })
  demoUrl: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: 'list',
    example: [
      { user: { name: 'John Doe' }, rating: 5, text: 'Great course!' },
      { user: { name: 'Jane Smith' }, rating: 4, text: 'Understandable.' },
    ],
  })
  reviews: Review[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: 'list',
    example: [{ title: 'Top Rated' }],
  })
  benefits: Benefit[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: 'list',
    example: [
      { title: 'Understanding Variables' },
      { title: 'Conditionals and Loops' },
    ],
  })
  prerequisites: Benefit[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: 'list',
    example: [
      { id: '1', title: 'Introduction' },
      { id: '2', title: 'Syntax and Data Types' },
    ],
  })
  courseData: CourseContent[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    example: 4.5,
  })
  ratings?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    example: 5,
  })
  purchased?: number;

  @IsNotEmpty()
  @ApiProperty({
    type: 'object',
    example: { name: 'John Doe', email: 'john.doe@example.com', id: 'some_id' },
  })
  instructor: Instructor;
}
