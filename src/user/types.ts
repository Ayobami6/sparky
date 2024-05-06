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
