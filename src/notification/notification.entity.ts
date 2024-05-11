import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { v4 as uuid } from 'uuid';

enum Status {
  UNREAD = 'UNREAD',
  READ = 'READ',
  DELETED = 'DELETED',
}

@Entity('notification')
export class NotificationEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.UNREAD,
  })
  status: Status;

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
