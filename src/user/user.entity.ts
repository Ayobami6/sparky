import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ObjectIdColumn,
  BeforeInsert,
  ObjectId,
} from 'typeorm';
import { RoleEnum, Avatar, Course } from './types';

@Entity('user')
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'text' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.user,
    nullable: false,
  })
  role: string;

  @Column({ nullable: true })
  avatar: Avatar;

  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column({ nullable: true })
  courses: Course[];

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @BeforeInsert()
  updateTimestamp() {
    this.updatedAt = new Date();
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}
