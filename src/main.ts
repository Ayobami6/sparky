import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './serializers/transformer-interceptors';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const config = new DocumentBuilder() //1
    .setTitle('Sparky E-Learning API')
    .setDescription('Sparky E-Learning Api documentation')
    .setVersion('1.0')
    .addBearerAuth(
      // Enable Bearer Auth here
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config); //2
  SwaggerModule.setup('docs', app, document); //3
  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
  logger.log(`Application is running on:  ${await app.getUrl()}`);
}
bootstrap();
