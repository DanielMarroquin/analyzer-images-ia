import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableCors({
    origin: '*',
    //origin: ['http://localhost:4200'],
  });
  const config = new DocumentBuilder()
  .setTitle('Analyzer Images - Service API')
  .setDescription('API para el servicio de la aplicación')
  // .setVersion(process.env.SERVICE_VERSION)
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Service is running on port ${port}`);
}

bootstrap();
