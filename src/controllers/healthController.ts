import { Request, Response } from 'express';
import os from 'os';

/**
 * HealthController class for handling health check requests
 * @class HealthController
 */
export class HealthController {
  /**
   * Check the health of the application
   * @param req - Express request object
   * @param res - Express response object
   */
  checkHealth = (req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      hostname: os.hostname(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  };
}
