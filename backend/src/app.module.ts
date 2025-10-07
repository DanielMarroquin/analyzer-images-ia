import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MainModule } from './modules/main.module';
import { SecurityModule } from './security/security.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SecurityModule,
    HealthModule,
    MainModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
