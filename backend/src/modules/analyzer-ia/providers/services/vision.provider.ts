

import { Injectable, Logger } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { v2 } from '@google-cloud/translate';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class VisionProvider {
  private visionClient: ImageAnnotatorClient | null = null;
  private translateClient: v2.Translate | null = null;
  private readonly logger = new Logger(VisionProvider.name);

  constructor() {
    this.safeInitialize();
  }

  private safeInitialize() {
    try {
      this.logger.debug('🔄 Initializing Google Clients...');

      const hasRequiredVars = process.env.GOOGLE_CLIENT_EMAIL && 
                             process.env.GOOGLE_PRIVATE_KEY && 
                             process.env.GOOGLE_PROJECT_ID;

      if (!hasRequiredVars) {
        this.logger.warn('⚠️ Google Services: Missing environment variables. Services will be disabled.');
        return;
      }

      const credentials = {
        type: process.env.GOOGLE_TYPE || 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
        token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN || 'googleapis.com',
      };

      // ✅ FORMA CORRECTA para Vision
      const auth = new GoogleAuth({
        credentials,
        projectId: credentials.project_id,
      });

      this.visionClient = new ImageAnnotatorClient({ auth });
      
      // ✅ FORMA CORRECTA para Translate (usa projectId directamente)
      this.translateClient = new v2.Translate({
        projectId: credentials.project_id,
        keyFilename: undefined, // No usar keyFilename si tenemos credentials
        credentials: credentials // Pasar las credentials directamente
      });

      this.logger.log('✅ Google Vision & Translation Clients initialized successfully');

    } catch (error) {
      this.logger.error('❌ Google Clients initialization failed:', error.message);
      this.visionClient = null;
      this.translateClient = null;
    }
  }

  private async translateText(text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      this.logger.warn('Texto vacío recibido para traducción');
      return text;
    }
  
    if (!this.translateClient) {
      this.logger.warn('Translation client not available, returning original text');
      return text;
    }
  
    try {
      const [translation] = await this.translateClient.translate(text, 'es');
      return translation;
    } catch (error) {
      this.logger.error('Translation error:', error);
      return text;
    }
  }

  async analyzeImage(imagePath: string) {
    if (!this.visionClient) {
      throw new Error('Google Vision Client no está disponible.');
    }
  
    const [result] = await this.visionClient.labelDetection(imagePath);
    
    const validLabels = result.labelAnnotations?.filter(label => 
      label.description && label.description.trim().length > 0
    ) || [];
  
    const translatedLabels = await Promise.all(
      validLabels.map(async (label) => {
        const translatedLabel = await this.translateText(label.description!);
        return {
          label: translatedLabel,
          confidence: label.score,
        };
      })
    );
    
    console.log(translatedLabels, 'translate')
    
    return { tags: translatedLabels };
  }

  isClientAvailable(): boolean {
    return this.visionClient !== null && this.translateClient !== null;
  }
}