import { Exclude } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { RoleEnum, Avatar, Course } from './types';

@Entity('user')
export class UserEntity {
  @ObjectIdColumn()
  _id: string;

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
}
