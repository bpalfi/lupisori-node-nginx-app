import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import movieRoutes from './routes/movieRoutes';
import { connectDB } from './config/database';
import { HealthController } from './controllers/healthController';
import swaggerSpec from './config/swagger';
import path from 'path';

// Load environment variables
dotenv.config();

// Create Express application
const app: Express = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/develop-CCP30-content-de';

// Initialize controllers
const healthController = new HealthController();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files are now served by nginx

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Serve Swagger JSON
app.get('/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/movies', movieRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Information
 *     description: Get basic information about the API and available endpoints
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Basic API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the Movies API
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: string
 *                       example: /api/movies
 *                     health:
 *                       type: string
 *                       example: /health
 *                     docs:
 *                       type: string
 *                       example: /api-docs
 *                     swagger:
 *                       type: string
 *                       example: /swagger.json
 */
// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Movies API',
    endpoints: {
      movies: '/api/movies',
      health: '/health',
      docs: '/api-docs',
      swagger: '/swagger.json'
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check the health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
// Health check endpoint
app.get('/health', healthController.checkHealth);

// Start the server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB with retry mechanism

    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);
    await connectDB(mongoUri, 10, 3000);

    // Start Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API documentation available at http://localhost:${port}/api/docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
