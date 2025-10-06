import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerIaservice } from './analyzer-ia.service';
import { VisionProvider } from '../providers/services/vision.provider';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('AnalyzerIaservice', () => {
  let service: AnalyzerIaservice;
  let visionProvider: VisionProvider;

  const mockVisionProvider = {
    analyzeImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyzerIaservice,
        {
          provide: VisionProvider,
          useValue: mockVisionProvider,
        },
      ],
    }).compile();

    service = module.get<AnalyzerIaservice>(AnalyzerIaservice);
    visionProvider = module.get<VisionProvider>(VisionProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyze', () => {
    const mockImageBuffer = Buffer.from('mock-image-data');
    const mockTempPath = '/tmp/test-image.jpg';

    beforeEach(() => {
      jest.clearAllMocks();
      
      (path.join as jest.Mock).mockReturnValue(mockTempPath);
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      
      (fs.promises.writeFile as jest.Mock) = jest.fn().mockResolvedValue(undefined);
      (fs.promises.unlink as jest.Mock) = jest.fn().mockResolvedValue(undefined);
    });

    it('should analyze image successfully', async () => {
      const mockResult = {
        tags: [
          { label: 'Animal', confidence: 0.95 },
          { label: 'Dog', confidence: 0.87 },
        ],
      };

      mockVisionProvider.analyzeImage.mockResolvedValue(mockResult);

      const result = await service.analyze(mockImageBuffer);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalledWith(mockTempPath, mockImageBuffer);
      expect(visionProvider.analyzeImage).toHaveBeenCalledWith(mockTempPath);
      expect(fs.promises.unlink).toHaveBeenCalledWith(mockTempPath);
      expect(result).toEqual(mockResult);
    });

    it('should create temp directory if it does not exist', async () => {
      const mockResult = { tags: [] };
      mockVisionProvider.analyzeImage.mockResolvedValue(mockResult);

      await service.analyze(mockImageBuffer);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should not create temp directory if it already exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      const mockResult = { tags: [] };
      mockVisionProvider.analyzeImage.mockResolvedValue(mockResult);

      await service.analyze(mockImageBuffer);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      const error = new Error('Vision API error');
      mockVisionProvider.analyzeImage.mockRejectedValue(error);

      await expect(service.analyze(mockImageBuffer)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.analyze(mockImageBuffer)).rejects.toThrow(
        'Error analizando imagen',
      );
    });

    it('should clean up temp file even if analysis fails', async () => {
      const error = new Error('Vision API error');
      mockVisionProvider.analyzeImage.mockRejectedValue(error);

      await expect(service.analyze(mockImageBuffer)).rejects.toThrow();

      expect(fs.promises.writeFile).toHaveBeenCalled();
      expect(fs.promises.unlink).toHaveBeenCalled();
    });
  });
});
