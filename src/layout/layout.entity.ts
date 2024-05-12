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

@Entity()
export class LayoutEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  faq: FaqItem[];

  @Column()
  categories: Category[];

  @Column()
  banner: Banner;

  @Column()
  createdAt: Date;

  @Column()
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
