import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  testServer(): any {
    return {
      success: true,
      message: 'Server is up and running',
    };
  }
}
