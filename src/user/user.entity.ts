import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum, Avatar, Course } from './types';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  avatar: Avatar;

  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column()
  courses: Course[];
}
