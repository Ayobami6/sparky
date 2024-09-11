import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  BeforeInsert,
} from 'typeorm';
@Entity('order')
export class OrderEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @ApiProperty({
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'User ID',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @Column()
  @ApiProperty({
    description: 'Course ID',
    type: 'string',
    format: 'uuid',
  })
  courseId: string;

  @Column()
  @ApiProperty({
    description: 'Payment Information',
    type: 'object',
    example: {
      cardNumber: '1234567890123456',
      expirationDate: '02/24',
      cvv: '123',
    },
    required: true,
  })
  payment_info: object;

  @Column()
  @ApiProperty({
    type: 'date',
    description: 'Order creation date',
    format: 'date-time',
    example: '2022-01-01T12:00:00Z',
  })
  createdAt: Date;

  @Column()
  @ApiProperty({
    type: 'date',
    description: 'Order update date',
    format: 'date-time',
    example: '2022-01-01T12:00:00Z',
    nullable: true,
    default: null,
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
      this.id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    }
  }
}
