// import { Injectable, InternalServerErrorException } from "@nestjs/common";
// import { VisionProvider } from "../providers/services/vision.provider";
// import * as fs from "fs";
// import * as path from "path";
// import { randomUUID } from "crypto";

// @Injectable()
// export class AnalyzerIaservice {
//   constructor(private readonly visionProvider: VisionProvider) {}

//   async analyze(imageBuffer: Buffer) {
//     try {
//       const tempDir = path.join(process.cwd(), "temp");
//       if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//       const tempPath = path.join(tempDir, `${randomUUID()}.jpg`);
//       await fs.promises.writeFile(tempPath, imageBuffer);

//       const result = await this.visionProvider.analyzeImage(tempPath);

//       await fs.promises.unlink(tempPath);

//       return result;
//     } catch (err) {
//       console.error("Error en AnalyzerIaservice:", err);
//       throw new InternalServerErrorException("Error analizando imagen");
//     }
//   }
// }

// import { Injectable, InternalServerErrorException } from "@nestjs/common";
// import { VisionProvider } from "../providers/services/vision.provider";
// import * as fs from "fs";
// import * as path from "path";
// import { randomUUID } from "crypto";
// import * as os from "os";

// @Injectable()
// export class AnalyzerIaservice {
//   constructor(private readonly visionProvider: VisionProvider) {}

//   async analyze(imageBuffer: Buffer) {
//     try {
//       // Verificar si el cliente de Vision está disponible
//       if (!this.visionProvider.isClientAvailable()) {
//         throw new Error('Google Vision service is not configured. Check environment variables.');
//       }
  
//       const tempDir = path.join(os.tmpdir(), "analyzer-images");
//       if (!fs.existsSync(tempDir)) {
//         fs.mkdirSync(tempDir, { recursive: true });
//       }
  
//       const tempPath = path.join(tempDir, `${randomUUID()}.jpg`);
//       await fs.promises.writeFile(tempPath, imageBuffer);
  
//       const result = await this.visionProvider.analyzeImage(tempPath);
  
//       // Limpiar archivo temporal
//       if (fs.existsSync(tempPath)) {
//         await fs.promises.unlink(tempPath);
//       }
  
//       return result;
//     } catch (err) {
//       console.error("Error en AnalyzerIaservice:", err);
      
//       if (err.message.includes('Google Vision service is not configured')) {
//         throw new InternalServerErrorException(
//           'El servicio de análisis de imágenes no está configurado. Contacta al administrador.'
//         );
//       }
      
//       throw new InternalServerErrorException("Error analizando imagen");
//     }
//   }

//   // async analyze(imageBuffer: Buffer) {
//   //   let tempPath: string | null = null;
    
//   //   try {
//   //     // ✅ CORREGIDO: Usar directorio temporal del sistema
//   //     const tempDir = path.join(os.tmpdir(), "analyzer-images");
      
//   //     // Crear directorio si no existe
//   //     if (!fs.existsSync(tempDir)) {
//   //       fs.mkdirSync(tempDir, { recursive: true });
//   //     }

//   //     // Generar ruta temporal única
//   //     tempPath = path.join(tempDir, `${randomUUID()}.jpg`);
      
//   //     // Guardar imagen temporal
//   //     await fs.promises.writeFile(tempPath, imageBuffer);

//   //     // Analizar imagen
//   //     const result = await this.visionProvider.analyzeImage(tempPath);

//   //     return result;
//   //   } catch (err) {
//   //     console.error("Error en AnalyzerIaservice:", err);
//   //     throw new InternalServerErrorException("Error analizando imagen");
//   //   } finally {
//   //     // ✅ Limpiar archivo temporal siempre
//   //     if (tempPath && fs.existsSync(tempPath)) {
//   //       try {
//   //         await fs.promises.unlink(tempPath);
//   //       } catch (cleanupError) {
//   //         console.warn("No se pudo eliminar archivo temporal:", cleanupError);
//   //       }
//   //     }
//   //   }
//   // }
// }

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
    try {
      // ✅ PRIMERO verificar si VisionProvider está disponible
      if (!this.visionProvider.isClientAvailable()) {
        console.log('🔧 Google Vision no configurado. Usando datos de prueba...');
        return this.getMockAnalysis();
      }

      // Si VisionProvider está disponible, usar el análisis real
      const tempDir = path.join(os.tmpdir(), "analyzer-images");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempPath = path.join(tempDir, `${randomUUID()}.jpg`);
      await fs.promises.writeFile(tempPath, imageBuffer);

      const result = await this.visionProvider.analyzeImage(tempPath);

      // Limpiar archivo temporal
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }

      return result;

    } catch (err) {
      console.error("Error en AnalyzerIaservice:", err);
      
      // Si hay error, devolver datos mock como fallback
      console.log('🔄 Fallback a datos mock debido a error...');
      return this.getMockAnalysis();
    }
  }

  // Método para generar análisis mock
  private getMockAnalysis() {
    // Simular procesamiento
    const mockLabels = [
      { label: 'technology', confidence: 0.95 },
      { label: 'electronics', confidence: 0.87 },
      { label: 'computer', confidence: 0.82 },
      { label: 'device', confidence: 0.78 },
      { label: 'modern', confidence: 0.75 },
      { label: 'innovation', confidence: 0.72 },
      { label: 'digital', confidence: 0.68 },
      { label: 'smart', confidence: 0.65 }
    ];

    // Mezclar aleatoriamente para variedad
    const shuffled = mockLabels.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5); // Tomar 5 aleatorios

    return { 
      tags: selected,
    };
  }
}