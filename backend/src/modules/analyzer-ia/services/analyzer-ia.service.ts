import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { VisionProvider } from "../providers/services/vision.provider";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

@Injectable()
export class AnalyzerIaservice {
  constructor(private readonly visionProvider: VisionProvider) {}

  async analyze(imageBuffer: Buffer) {
    try {
      const tempDir = path.join(process.cwd(), "temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const tempPath = path.join(tempDir, `${randomUUID()}.jpg`);
      await fs.promises.writeFile(tempPath, imageBuffer);

      const result = await this.visionProvider.analyzeImage(tempPath);

      await fs.promises.unlink(tempPath);

      return result;
    } catch (err) {
      console.error("Error en AnalyzerIaservice:", err);
      throw new InternalServerErrorException("Error analizando imagen");
    }
  }
}
