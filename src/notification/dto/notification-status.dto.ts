import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  @ApiProperty({
    type: 'string',
    enum: Status,
    enumName: 'NotificationStatus',
    example: 'UNREAD',
    description: 'The status of the notification',
  })
  status: Status;
}
