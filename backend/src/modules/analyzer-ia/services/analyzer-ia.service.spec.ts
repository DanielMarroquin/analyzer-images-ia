import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerIaservice } from './analyzer-ia.service';
import { VisionProvider } from '../providers/services/vision.provider';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock the VisionProvider
jest.mock('../providers/services/vision.provider', () => ({
  VisionProvider: jest.fn().mockImplementation(() => ({
    analyzeImage: jest.fn(),
  })),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
    unlink: jest.fn(),
  },
}));
jest.mock('path');
jest.mock('os');

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
      
      // Mock path.join to return different values for different calls
      (path.join as jest.Mock)
        .mockReturnValueOnce('/tmp/analyzer-images') // for tempDir
        .mockReturnValueOnce(mockTempPath); // for tempPath
      (os.tmpdir as jest.Mock).mockReturnValue('/tmp');
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      
      // Mock fs.promises properly
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
      
      // Reset the path.join mock for each test
      (path.join as jest.Mock).mockClear();
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

      expect(visionProvider.analyzeImage).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should create temp directory if it does not exist', async () => {
      const mockResult = { tags: [] };
      mockVisionProvider.analyzeImage.mockResolvedValue(mockResult);

      await service.analyze(mockImageBuffer);

      expect(visionProvider.analyzeImage).toHaveBeenCalled();
    });

    it('should not create temp directory if it already exists', async () => {
      const mockResult = { tags: [] };
      mockVisionProvider.analyzeImage.mockResolvedValue(mockResult);

      await service.analyze(mockImageBuffer);

      expect(visionProvider.analyzeImage).toHaveBeenCalled();
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

      expect(visionProvider.analyzeImage).toHaveBeenCalled();
    });
  });
});
