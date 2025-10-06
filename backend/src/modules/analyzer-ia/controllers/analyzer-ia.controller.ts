import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UsePipes,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AnalyzerIaservice } from "../services/analyzer-ia.service";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { AnalyzerImageDto } from "../dto/analyzer-image.dto";
import { FileValidationPipe } from "../../../security/file-validation.pipe";

@ApiTags("Analyzer IA")
@Controller("analyzer-ia")
export class AnalyzerIaController {
  constructor(private readonly analyzerIaService: AnalyzerIaservice) {}

  @Post("image")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: AnalyzerImageDto })
  @UseInterceptors(FileInterceptor("file"))
  @UsePipes(new FileValidationPipe())
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.analyzerIaService.analyze(file.buffer);
    return result;
  }
  
}
