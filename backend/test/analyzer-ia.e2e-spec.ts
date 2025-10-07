import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AnalyzerIA (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/v1/analyzer-ia/image (POST)', () => {
    it('should return 400 when no file is provided', () => {
      return request(app.getHttpServer())
        .post('/api/v1/analyzer-ia/image')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('No se envió ningún archivo');
        });
    });

    it('should return 400 when invalid file type is provided', () => {
      const invalidFile = Buffer.from('not-an-image');
      
      return request(app.getHttpServer())
        .post('/api/v1/analyzer-ia/image')
        .attach('file', invalidFile, 'test.txt')
        .expect(400);
    });

    it('should analyze image successfully with valid file', () => {
      // Create a mock image buffer (1x1 pixel PNG)
      const mockImageBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );

      return request(app.getHttpServer())
        .post('/api/v1/analyzer-ia/image')
        .attach('file', mockImageBuffer, 'test.png')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('tags');
          expect(Array.isArray(res.body.tags)).toBe(true);
        });
    });
  });

  describe('/api/v1/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body.status).toBe('ok');
        });
    });
  });
});
