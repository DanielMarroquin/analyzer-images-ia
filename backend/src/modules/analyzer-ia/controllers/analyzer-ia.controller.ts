import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AnalyzerIaservice } from "../services/analyzer-ia.service";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { AnalyzerImageDto } from "../dto/analyzer-image.dto";

@ApiTags("Analyzer IA")
@Controller("analyzer-ia")
export class AnalyzerIaController {
  constructor(private readonly analyzerIaService: AnalyzerIaservice) {}

  @Post("image")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: AnalyzerImageDto })
  @UseInterceptors(FileInterceptor("file"))
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No se envió ningún archivo");
    }
  
    const imagePath = file.path || file.buffer;
    const result = await this.analyzerIaService.analyze(file.buffer);
    return result;
  }
  
}
