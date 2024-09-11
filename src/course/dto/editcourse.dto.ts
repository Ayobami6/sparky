import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Benefit, CourseContent, Review, Thumbnail } from '../course-types';
import { ApiProperty } from '@nestjs/swagger';

export class EditCourseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'name',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'description',
    example: 'A comprehensive guide to web development.',
  })
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    format: 'price',
    example: 200,
  })
  price: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    type: 'integer',
    format: 'estimatedPrice',
    example: 250,
  })
  estimatedPrice: number;

  @IsOptional()
  @ApiProperty({
    type: 'object',
    properties: {
      public_id: {
        type: 'string',
        format: 'public_id',
      },
      url: {
        type: 'string',
        format: 'url',
      },
    },
    example: {
      public_id: 'abc123',
      url: 'https://example.com/thumbnail.jpg',
    },
  })
  thumbnail?: Thumbnail;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'url',
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

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: 'list',
    example: [
      { title: 'Introduction', description: 'Learn the basics.' },
      { title: 'HTML', description: 'Create basic web pages.' },
    ],
  })
  benefits: Benefit[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: 'list',
    example: [{ title: 'HTML Basics' }, { title: 'CSS Fundamentals' }],
  })
  prerequisites: Benefit[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    type: 'list',
    example: [
      {
        id: 'abc123',
        title: 'Introduction',
        description: 'Learn the basics.',
        videoUrl: 'https://example.com/video1.mp4',
        videoSection: 'Introduction',
        videoLength: 10,
        videoPlayer: 'YouTube',
        links: [{ title: 'Link 1', url: 'https://example.com/link1' }],
        suggestion: 'Watch this first.',
        questions: [
          { question: 'What is HTML?', answer: 'Hypertext Markup Language.' },
        ],
      },
    ],
  })
  courseData: CourseContent[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    format: 'number',
    example: 4.5,
  })
  ratings?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    format: 'number',
    example: 10,
  })
  purchased?: number;
}
