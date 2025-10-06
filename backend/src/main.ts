// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from './app.module';
// // import { ValidationPipe } from '@nestjs/common';
// // import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// // import helmet from 'helmet';

// // async function bootstrap() {
// //   const app = await NestFactory.create(AppModule);
// //   const port = process.env.PORT ?? 3000;
  
// //   app.use(helmet());
  
// //   app.setGlobalPrefix('api/v1');
// //   app.useGlobalPipes(new ValidationPipe({}));
// //   app.enableCors({
// //     origin: function (origin, callback) {
// //       if (process.env.NODE_ENV !== 'production') {
// //         return callback(null, true);
// //       }
      
// //       const allowedOrigins = [
// //         'https://analyzer-images-ia-production.up.railway.app'
// //       ];
      
// //       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
// //         callback(null, true);
// //       } else {
// //         callback(new Error('Not allowed by CORS'));
// //       }
// //     },
// //     credentials: true,
// //   });
// //   const config = new DocumentBuilder()
// //   .setTitle('Analyzer Images - Service API')
// //   .setDescription('API para el servicio de la aplicación')
// //   // .setVersion(process.env.SERVICE_VERSION)
// //   .setVersion('1.0.0')
// //   .addBearerAuth()
// //   .build();
// //   const document = SwaggerModule.createDocument(app, config);
// //   SwaggerModule.setup('doc', app, document);
// //   await app.listen(process.env.PORT ?? 3000);
// //   console.log(`Service is running on port ${port}`);
// // }

// // bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import helmet from 'helmet';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   // ✅ CRÍTICO: Usar process.env.PORT sin valor por defecto 8080
//   const port = process.env.PORT || 3000;
  
//   console.log('Environment PORT:', process.env.PORT); // Para debug
//   console.log('Final port:', port); // Para debug
  
//   app.use(helmet());
  
//   app.setGlobalPrefix('api/v1');
//   app.useGlobalPipes(new ValidationPipe({}));
  
//   app.enableCors({
//     origin: process.env.NODE_ENV === 'production' 
//       ? [
//           'https://analyzer-images-ia-production.up.railway.app',
//           'https://unique-consideration.up.railway.app'
//         ] 
//       : ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5173'],
//     credentials: true,
//   });

//   const config = new DocumentBuilder()
//     .setTitle('Analyzer Images - Service API')
//     .setDescription('API para el servicio de la aplicación')
//     .setVersion('1.0.0')
//     .addBearerAuth()
//     .build();
  
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('doc', app, document);
  
//   await app.listen(port);
//   console.log(`✅ Service is running on port ${port}`);
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  try {
    console.log('🚀 Starting NestJS application bootstrap...');
    
    const app = await NestFactory.create(AppModule);
    
    const port = process.env.PORT || 3000;
    console.log('🔧 Environment check:', {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN
    });

    app.use(helmet());
    
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({}));
    
    // CORS temporalmente permisivo para debugging
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Health check básico
    app.getHttpAdapter().get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'analyzer-images-ia', timestamp: new Date().toISOString() });
    });

    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Analyzer Images - Service API')
      .setDescription('API para el servicio de la aplicación')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
    
    console.log(`✅ NestJS app configured successfully. Starting on port ${port}...`);
    
    await app.listen(port);
    
    console.log(`🎉 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/doc`);
    console.log(`❤️ Health check: http://localhost:${port}/health`);
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR during application bootstrap:', error);
    console.error('Stack trace:', error.stack);
    
    // Esperar 5 segundos antes de salir para poder ver el error en logs
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
}

bootstrap();