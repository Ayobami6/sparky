import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ObjectIdColumn,
  ObjectId,
  BeforeInsert,
} from 'typeorm';
import { Benefit, CourseContent, Instructor, Review } from './course-types';

@Entity('course')
export class CourseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  estimatedPrice: number;

  @Column({ nullable: true })
  thumbnail: object;

  @Column()
  tags: string[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  level: string;

  @Column()
  demoUrl: string;

  @Column()
  benefits: Benefit[];

  @Column()
  prerequisites: Benefit[];

  @Column()
  reviews: Review[];

  @Column()
  instructor: Instructor;

  @Column()
  courseData: CourseContent[];

  @Column({ default: 0 })
  ratings: number;

  @Column({ default: 0 })
  purchased: number;

  @BeforeInsert()
  updateTimestamp() {
    this.updatedAt = new Date();
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}
