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

export class EditCourseDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  estimatedPrice: number;

  @IsOptional()
  thumbnail?: Thumbnail;

  @IsOptional()
  @IsString()
  level: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  demoUrl: string;

  @IsOptional()
  @IsArray()
  reviews: Review[];

  @IsOptional()
  @IsArray()
  benefits: Benefit[];

  @IsOptional()
  @IsArray()
  prerequisites: Benefit[];

  @IsArray()
  @IsOptional()
  courseData: CourseContent[];

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsOptional()
  @IsNumber()
  purchased?: number;
}
