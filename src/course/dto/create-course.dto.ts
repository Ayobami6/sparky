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
} from '../course-types';

export class CreateCourseDto implements Course {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsInt()
  estimatedPrice: number;

  @IsOptional()
  id: string;

  @IsOptional()
  thumbnail?: object;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsString()
  demoUrl: string;

  @IsOptional()
  @IsArray()
  reviews: Review[];

  @IsNotEmpty()
  @IsArray()
  benefits: Benefit[];

  @IsNotEmpty()
  @IsArray()
  prerequisites: Benefit[];

  @IsArray()
  @IsNotEmpty()
  courseData: CourseContent[];

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsOptional()
  @IsNumber()
  purchased?: number;

  @IsNotEmpty()
  instructor: Instructor;
}
