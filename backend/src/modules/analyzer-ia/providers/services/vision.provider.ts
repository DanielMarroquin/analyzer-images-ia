// // 

// import { Injectable, Logger } from '@nestjs/common';
// import { ImageAnnotatorClient } from '@google-cloud/vision';

// @Injectable()
// export class VisionProvider {
//   private client: ImageAnnotatorClient | null = null;
//   private readonly logger = new Logger(VisionProvider.name);

//   constructor() {
//     this.initializeClient();
//   }

//   private initializeClient() {
//     try {
//       this.logger.debug('Initializing Google Vision Client...');

//       // Verificar variables críticas
//       const requiredVars = {
//         GOOGLE_TYPE: process.env.GOOGLE_TYPE,
//         GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
//         GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
//         GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
//       };

//       this.logger.debug('Required variables check:', requiredVars);

//       // Verificar si todas las variables requeridas están presentes
//       const missingVars = Object.entries(requiredVars)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);

//       if (missingVars.length > 0) {
//         this.logger.warn(`Missing required Google variables: ${missingVars.join(', ')}`);
//         this.logger.warn('Google Vision Client will not be available');
//         return;
//       }

//       const credentials = {
//         type: process.env.GOOGLE_TYPE,
//         project_id: process.env.GOOGLE_PROJECT_ID,
//         private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         auth_uri: process.env.GOOGLE_AUTH_URI,
//         token_uri: process.env.GOOGLE_TOKEN_URI,
//         auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
//         client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
//         universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
//       };

//       this.logger.debug('Creating Google Vision Client with credentials...');

//       this.client = new ImageAnnotatorClient({
//         credentials,
//         projectId: credentials.project_id,
//       });

//       this.logger.log('✅ Google Vision Client initialized successfully');

//     } catch (error) {
//       this.logger.error('❌ Failed to initialize Google Vision Client:', error);
//       this.client = null;
//     }
//   }

//   async analyzeImage(imagePath: string) {
//     if (!this.client) {
//       throw new Error('Google Vision Client no está disponible. Verifica las variables de entorno de Google.');
//     }

//     try {
//       this.logger.debug(`Analyzing image: ${imagePath}`);
      
//       const [result] = await this.client.labelDetection(imagePath);
//       const labels = result.labelAnnotations?.map((label) => ({
//         label: label.description,
//         confidence: label.score,
//       })) || [];

//       this.logger.debug(`Analysis completed. Found ${labels.length} labels`);
      
//       return { tags: labels };

//     } catch (error) {
//       this.logger.error('Error in analyzeImage:', error);
//       throw new Error(`Image analysis failed: ${error.message}`);
//     }
//   }

//   isClientAvailable(): boolean {
//     return this.client !== null;
//   }
// }


import { Injectable, Logger } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class VisionProvider {
  private client: ImageAnnotatorClient | null = null;
  private readonly logger = new Logger(VisionProvider.name);

  constructor() {
    this.safeInitialize();
  }

  private safeInitialize() {
    try {
      this.logger.debug('🔄 Attempting to initialize Google Vision Client...');

      // Verificar variables críticas sin fallar
      const hasRequiredVars = process.env.GOOGLE_CLIENT_EMAIL && 
                             process.env.GOOGLE_PRIVATE_KEY && 
                             process.env.GOOGLE_PROJECT_ID;

      if (!hasRequiredVars) {
        this.logger.warn('⚠️ Google Vision: Missing environment variables. Service will be disabled.');
        return;
      }

      const credentials = {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
      };

      this.client = new ImageAnnotatorClient({
        credentials,
        projectId: credentials.project_id,
      });

      this.logger.log('✅ Google Vision Client initialized successfully');

    } catch (error) {
      this.logger.error('❌ Google Vision initialization failed (non-critical):', error.message);
      this.client = null;
    }
  }

  async analyzeImage(imagePath: string) {
    if (!this.client) {
      throw new Error('Google Vision Client no está disponible. Verifica las variables de entorno de Google.');
    }

    const [result] = await this.client.labelDetection(imagePath);
    const labels = result.labelAnnotations?.map((label) => ({
      label: label.description,
      confidence: label.score,
    })) || [];
    
    return { tags: labels };
  }

  isClientAvailable(): boolean {
    return this.client !== null;
  }
}