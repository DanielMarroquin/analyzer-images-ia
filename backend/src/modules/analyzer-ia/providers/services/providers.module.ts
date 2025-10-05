import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VisionProvider } from './vision.provider';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [VisionProvider],
  exports: [VisionProvider],
})


export class ProvidersModule {}

