import { Module } from '@nestjs/common';
import { ProvidersModule } from './analyzer-ia/providers/services/providers.module';
import { HttpModule } from '@nestjs/axios';
import { AnalyzerModule } from './analyzer-ia/analyzer.module';

@Module({
  imports: [
    HttpModule,
    ProvidersModule,
    AnalyzerModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}