import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  
  app.use(helmet());
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableCors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      const allowedOrigins = [
        'https://analyzer-images-ia-production.up.railway.app'
      ];
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
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
