// import { Injectable } from '@nestjs/common';
// import { ImageAnnotatorClient } from '@google-cloud/vision';
// import * as path from 'path';

// @Injectable()
// export class VisionProvider {
//   private client: ImageAnnotatorClient;

//   constructor() {
//     const credentialsPath = path.resolve(
//       process.env.GOOGLE_APPLICATION_CREDENTIALS || 'src/config/project-ia-images-bcdc24f6e2d1.json',
//     );

//     if (!credentialsPath) {
//       throw new Error(
//         'GOOGLE APPLICATION CREDENTIALS no está definida en el .env',
//       );
//     }

//     const resolvedPath = path.resolve(credentialsPath);
//     console.log('🧠 Using Google credentials from:', resolvedPath);

//     this.client = new ImageAnnotatorClient({
//       keyFilename: resolvedPath,
//     });
//   }

//   async analyzeImage(imagePath: string) {
//     const [result] = await this.client.labelDetection(imagePath);
//     const labels =
//       result.labelAnnotations?.map((label) => ({
//         label: label.description,
//         confidence: label.score,
//       })) || [];
//     return { tags: labels };
//   }
// }


import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class VisionProvider {
  private client: ImageAnnotatorClient;

  constructor(private readonly configService: ConfigService) {
    const credentials = {
      type: this.configService.get('GOOGLE_TYPE'),
      project_id: this.configService.get('GOOGLE_PROJECT_ID'),
      private_key_id: this.configService.get('GOOGLE_PRIVATE_KEY_ID'),
      private_key: this.configService
        .get('GOOGLE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'), // importante
      client_email: this.configService.get('GOOGLE_CLIENT_EMAIL'),
      client_id: this.configService.get('GOOGLE_CLIENT_ID'),
      auth_uri: this.configService.get('GOOGLE_AUTH_URI'),
      token_uri: this.configService.get('GOOGLE_TOKEN_URI'),
      auth_provider_x509_cert_url: this.configService.get(
        'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: this.configService.get(
        'GOOGLE_CLIENT_X509_CERT_URL',
      ),
      universe_domain: this.configService.get('GOOGLE_UNIVERSE_DOMAIN'),
    };

    this.client = new ImageAnnotatorClient({
      credentials, 
      projectId: credentials.project_id,
    });
  }

  async analyzeImage(imagePath: string) {
    const [result] = await this.client.labelDetection(imagePath);
    const labels =
      result.labelAnnotations?.map((label) => ({
        label: label.description,
        confidence: label.score,
      })) || [];
    return { tags: labels };
  }
}
