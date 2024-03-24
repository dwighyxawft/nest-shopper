import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.enableCors()
  const config = new DocumentBuilder()
  .setTitle('Ecommerce website API')
  .setDescription('Shopping website API description')
  .setVersion('1.0')
  .build();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  const document = SwaggerModule.createDocument(app, config);
  app.use(cookieParser());
  SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
