import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerIaController } from './analyzer-ia.controller';
import { AnalyzerIaservice } from '../services/analyzer-ia.service';
import { BadRequestException } from '@nestjs/common';

describe('AnalyzerIaController', () => {
  let controller: AnalyzerIaController;
  let service: AnalyzerIaservice;

  const mockAnalyzerService = {
    analyze: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzerIaController],
      providers: [
        {
          provide: AnalyzerIaservice,
          useValue: mockAnalyzerService,
        },
      ],
    }).compile();

    controller = module.get<AnalyzerIaController>(AnalyzerIaController);
    service = module.get<AnalyzerIaservice>(AnalyzerIaservice);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyzeImage', () => {
    it('should throw BadRequestException when no file is provided', async () => {
      await expect(controller.analyzeImage(undefined as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.analyzeImage(undefined as any)).rejects.toThrow(
        'No se envió ningún archivo',
      );
    });

    it('should call service.analyze with file buffer when file is provided', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const mockResult = {
        tags: [
          { label: 'Animal', confidence: 0.95 },
          { label: 'Dog', confidence: 0.87 },
        ],
      };

      mockAnalyzerService.analyze.mockResolvedValue(mockResult);

      const result = await controller.analyzeImage(mockFile);

      expect(service.analyze).toHaveBeenCalledWith(mockFile.buffer);
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const error = new Error('Service error');
      mockAnalyzerService.analyze.mockRejectedValue(error);

      await expect(controller.analyzeImage(mockFile)).rejects.toThrow(error);
    });
  });
});
