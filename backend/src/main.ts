import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });
  
  const port = process.env.PORT || 3000;
  
  app.use(helmet());
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: true, 
    credentials: true,
  });

  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'analyzer-images-ia', 
      timestamp: new Date().toISOString() 
    });
  });

  const config = new DocumentBuilder()
    .setTitle('Analyzer Images API')
    .setDescription('API para análisis de imágenes con IA')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(port);
  
  console.log(`🚀 Application running on port ${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/docs`);
}

bootstrap();