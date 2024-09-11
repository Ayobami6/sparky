import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { Banner, Category, FaqItem } from './layout-types';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class LayoutEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier for the layout',
  })
  id: string;

  @Column()
  @ApiProperty({
    type: 'string',
    description: 'Type of layout',
  })
  type: string;

  @Column()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: { question: { type: 'string' }, answer: { type: 'string' } },
    },
    description: 'List of frequently asked questions and their answers',
  })
  faq: FaqItem[];

  @Column()
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'List of categories in the layout',
  })
  categories: Category[];

  @Column()
  @ApiProperty({
    type: 'object',
    properties: {
      title: { type: 'string' },
      image: {
        type: 'object',
        properties: { public_id: { type: 'string' }, url: { type: 'string' } },
      },
      subtitle: { type: 'string' },
    },
    description: 'Layout banner',
  })
  banner: Banner;

  @Column()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Timestamp for when the layout was created',
  })
  createdAt: Date;

  @Column()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Timestamp for when the layout was last updated',
  })
  updatedAt: Date;

  @BeforeInsert()
  updateTimestamp() {
    this.updatedAt = new Date();
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  @BeforeInsert()
  createId() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
