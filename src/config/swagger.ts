import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movies API Documentation',
      version,
      description: 'API documentation for the Movies API',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Current server'
      }
    ],
    components: {
      schemas: {
        Movie: {
          type: 'object',
          required: ['title', 'director', 'year', 'genre', 'rating'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the movie'
            },
            title: {
              type: 'string',
              description: 'The title of the movie'
            },
            director: {
              type: 'string',
              description: 'The director of the movie'
            },
            year: {
              type: 'integer',
              description: 'The year the movie was released',
              minimum: 1888,
              maximum: new Date().getFullYear()
            },
            genre: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western']
              },
              description: 'The genre(s) of the movie'
            },
            rating: {
              type: 'number',
              description: 'The rating of the movie (1-10)',
              minimum: 1,
              maximum: 10
            },
            description: {
              type: 'string',
              description: 'A brief description of the movie'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the movie was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the movie was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            },
            error: {
              type: 'string'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            uptime: {
              type: 'number'
            },
            memoryUsage: {
              type: 'object'
            },
            environment: {
              type: 'string'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource Not Found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
