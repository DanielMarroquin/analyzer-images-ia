import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { VisionProvider } from "../providers/services/vision.provider";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import * as os from "os";

@Injectable()
export class AnalyzerIaservice {
  constructor(private readonly visionProvider: VisionProvider) {}

  async analyze(imageBuffer: Buffer) {
    const tempDir = path.join(os.tmpdir(), "analyzer-images");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPath = path.join(tempDir, `${randomUUID()}.jpg`);
    
    try {
      await fs.promises.writeFile(tempPath, imageBuffer);

      const result = await this.visionProvider.analyzeImage(tempPath);
      
      return result;

    } catch (error) {
      throw new InternalServerErrorException('Error analizando imagen');
    } finally {
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    }
  }
}