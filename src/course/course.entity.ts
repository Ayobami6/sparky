import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ObjectIdColumn,
  ObjectId,
  BeforeInsert,
} from 'typeorm';
import {
  Benefit,
  CourseContent,
  Instructor,
  Review,
  Thumbnail,
} from './course-types';
import { ApiProperty } from '@nestjs/swagger';

@Entity('course')
export class CourseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '60195d59-0b6a-4429-a585-77b59f186705',
    description: 'Unique identifier for the course',
  })
  id: string;

  @Column()
  @ApiProperty({
    example: 'Introduction to Java',
    description: 'Title of the course',
  })
  name: string;

  @Column()
  @ApiProperty({
    example: 'Learn the basics of Java programming language',
    description: 'Description of the course',
  })
  description: string;

  @Column()
  @ApiProperty({
    type: 'integer',
    example: 99,
    description: 'price of course',
  })
  price: number;

  @Column()
  @ApiProperty({
    type: 'integer',
    example: 99,
    description: 'Estimated price of course',
  })
  estimatedPrice: number;

  @Column({ nullable: true })
  @ApiProperty({
    type: 'object',
    example: { public_id: 'image123', url: 'https://example.com/image123' },
    description: 'Thumbnail of the course',
  })
  thumbnail: Thumbnail;

  @Column()
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Java', 'Programming', 'Basics'],
    description: 'Tags associated with the course',
  })
  tags: string[];

  @Column()
  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Date when the course was created',
  })
  createdAt: Date;

  @Column()
  @ApiProperty({
    type: 'date',
    example: '2022-01-01T00:00:00.000Z',
    description: 'Date when the course was updated',
  })
  updatedAt: Date;

  @Column()
  @ApiProperty({
    type: 'string',
    example: 'Beginner',
    description: 'Level of the course',
  })
  level: string;

  @Column()
  @ApiProperty({
    type: 'string',
    example: 'https://example.com/demo.mp4',
    description: 'URL of the course demo video',
  })
  demoUrl: string;

  @Column()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
    },
    example: [{ title: 'Introduction' }, { title: 'Syntax' }],
    description: 'Benefits associated with the course',
  })
  benefits: Benefit[];

  @Column()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
    },
    example: [{ title: 'Introduction' }, { title: 'Syntax' }],
    description: 'Prerequisites associated with the course',
  })
  prerequisites: Benefit[];

  @Column()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        rating: { type: 'integer' },
        text: { type: 'string' },
        replies: { type: 'array', items: { type: 'object' } },
      },
    },
    example: [
      {
        user: { name: 'John Doe', email: 'john.doe@example.com' },
        rating: 5,
        text: 'Great course!',
        replies: [
          {
            user: { name: 'Jane Doe', email: 'jane.doe@example.com' },
            text: 'Thank you!',
          },
        ],
      },
    ],
    description: 'Reviews associated with the course',
  })
  reviews: Review[];

  @Column()
  @ApiProperty({
    type: 'object',
    example: { name: 'John Doe', email: 'john.doe@example.com' },
    description: 'Instructor associated with the course',
  })
  instructor: Instructor;

  @Column()
  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    example: [{ title: 'Introduction' }, { title: 'Syntax' }],
    description: 'Course content associated with the course',
  })
  courseData: CourseContent[];

  @Column({ default: 0 })
  @ApiProperty({
    type: 'integer',
    example: 4,
    description: 'Number of ratings associated with the course',
  })
  ratings: number;

  @Column({ default: 0 })
  @ApiProperty({
    type: 'integer',
    example: 99,
    description: 'Number of purchases associated with the course',
  })
  purchased: number;

  @BeforeInsert()
  updateTimestamp() {
    this.updatedAt = new Date();
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}
