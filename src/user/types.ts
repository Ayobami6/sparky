import { UserEntity } from './user.entity';

export enum RoleEnum {
  user = 'user',
  admin = 'admin',
}

export interface Avatar {
  publicUrl: string;
  url: string;
}

export interface Course {
  courseId: string;
}

export interface ActivationResponse {
  token: string;
  activationCode: string;
}

export interface Message {
  success: boolean;
  message?: string;
  activationToken?: string;
  user?: UserEntity;
  data?: any;
}
