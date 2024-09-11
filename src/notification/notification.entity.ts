import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { v4 as uuid } from 'uuid';

export enum Status {
  UNREAD = 'UNREAD',
  READ = 'READ',
  DELETED = 'DELETED',
}

@Entity('notification')
export class NotificationEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier for the notification',
  })
  id: string;

  @Column()
  @ApiProperty({
    type: 'string',
    description: 'Title of the notification',
    example: 'New message from John Doe',
  })
  title: string;

  @Column()
  @ApiProperty({
    type: 'string',
    description: 'Content of the notification',
    example: 'Hey John, I sent you a message',
  })
  message: string;

  @Column()
  @ApiProperty({
    type: 'string',
    description: 'User who received the notification',
    example: 'user123',
  })
  userId: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.UNREAD,
  })
  @ApiProperty({
    type: 'string',
    description: 'Status of the notification',
    example: 'UNREAD',
    enum: Status,
  })
  status: Status;

  @Column()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Date and time when the notification was created',
    example: '2022-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @Column()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Date and time when the notification was last updated',
    example: '2022-01-01T12:00:00.000Z',
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
