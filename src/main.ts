import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './serializers/transformer-interceptors';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  logger.log(`Application is running on:  ${await app.getUrl()}`);
}
bootstrap();
