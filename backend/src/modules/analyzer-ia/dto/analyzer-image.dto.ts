import { ApiProperty } from "@nestjs/swagger";

export class AnalyzerImageDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Imagen a analizar",
  })
  file: any;
}
