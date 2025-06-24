import { Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

describe('HealthController', () => {
  let healthController: HealthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.Mock;

  beforeEach(() => {
    healthController = new HealthController();

    // Create mock request and response objects
    mockRequest = {};

    jsonSpy = jest.fn().mockReturnValue({});
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonSpy
    };
  });

  describe('checkHealth', () => {
    it('should return 200 status code', () => {
      // Call the controller method
      healthController.checkHealth(mockRequest as Request, mockResponse as Response);

      // Verify status code
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return health information', () => {
      // Call the controller method
      healthController.checkHealth(mockRequest as Request, mockResponse as Response);

      // Verify response contains expected fields
      expect(jsonSpy).toHaveBeenCalled();

      const responseData = jsonSpy.mock.calls[0][0];
      expect(responseData).toHaveProperty('status', 'ok');
      expect(responseData).toHaveProperty('timestamp');
      expect(responseData).toHaveProperty('uptime');
      expect(responseData).toHaveProperty('memoryUsage');
      expect(responseData).toHaveProperty('environment');
    });
  });
});
