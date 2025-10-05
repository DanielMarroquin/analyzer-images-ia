import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from "./providers/services/providers.module";
import { AnalyzerIaController } from "./controllers/analyzer-ia.controller";
import { AnalyzerIaservice } from "./services/analyzer-ia.service";



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProvidersModule,
  ],
  controllers: [AnalyzerIaController],
  providers: [AnalyzerIaservice],
  exports: [AnalyzerIaservice],
})
export class AnalyzerModule {}