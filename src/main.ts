import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const config = new DocumentBuilder()
  .setTitle('Ecommerce website API')
  .setDescription('Shopping website API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(cookieParser());
  SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
