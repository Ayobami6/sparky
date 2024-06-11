import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      success: true,
      message: 'Welcome Sparky E-learning Webservices',
      docs_url: '/docs',
    };
  }
  testServer(): any {
    return {
      success: true,
      message: 'Server is up and running',
    };
  }
}
