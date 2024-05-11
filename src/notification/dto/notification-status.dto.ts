import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../notification.entity';

export class NotificationStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
