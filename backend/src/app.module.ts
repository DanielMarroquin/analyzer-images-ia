import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MainModule } from './modules/main.module';
import { SecurityModule } from './security/security.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SecurityModule,
    MainModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
