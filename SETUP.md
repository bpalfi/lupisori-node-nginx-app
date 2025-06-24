# Step-by-Step Guide: Building a Node.js Web Application with TypeScript and MongoDB

This document outlines the steps taken to create this Node.js web application with TypeScript, Express, and MongoDB integration.

## 1. Project Initialization

```bash
# Create a new directory for the project
mkdir Lupisori_web
cd Lupisori_web

# Initialize a new Node.js project
npm init -y

# Initialize git repository
git init
```

## 2. TypeScript Setup

```bash
# Install TypeScript and related dependencies
npm install --save-dev typescript @types/node

# Create tsconfig.json
npx tsc --init

# Modify tsconfig.json with appropriate settings
```

The `tsconfig.json` was configured with:
```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

## 3. Project Structure Setup

```bash
# Create the directory structure
mkdir -p src/controllers src/services src/models src/routes src/config src/utils src/__tests__

# Create initial index.ts file
touch src/index.ts
```

## 4. Installing Dependencies

```bash
# Install production dependencies
npm install express mongoose dotenv cors helmet

# Install development dependencies
npm install --save-dev @types/express @types/cors nodemon ts-node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin jest ts-jest @types/jest
```

## 5. Configure package.json Scripts

Updated `package.json` with the following scripts:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts",
  "test": "jest",
  "lint": "eslint . --ext .ts",
  "seed": "ts-node src/utils/seeder.ts"
}
```

## 6. Setting Up Express Application

Created `src/index.ts` with:
- Express application initialization
- Middleware configuration (cors, helmet, json parsing)
- Route registration
- Error handling
- Server startup logic

## 7. Environment Configuration

```bash
# Create .env.example file
touch .env.example
```

Added environment variables to `.env.example`:
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/develop-CCP30-content-de
LOG_LEVEL=info
```

## 8. Database Configuration

Created `src/config/database.ts` with:
- MongoDB connection function
- Connection error handling
- Database close function

## 9. Creating Models

Created `src/models/movieModel.ts` with:
- Mongoose schema definition
- Interface for type safety
- Validation rules
- Timestamps

## 10. Implementing Services

Created `src/services/movieService.ts` with:
- Business logic for CRUD operations
- Pagination implementation
- Error handling

## 11. Creating Controllers

Created `src/controllers/movieController.ts` and `src/controllers/healthController.ts` with:
- Request handling
- Response formatting
- Error handling
- Input validation

## 12. Setting Up Routes

Created `src/routes/movieRoutes.ts` with:
- Route definitions
- Controller method mapping
- Route documentation

## 13. Data Seeding

Created `src/utils/seeder.ts` with:
- Sample movie data
- Database seeding logic

## 14. Testing Setup

```bash
# Create Jest configuration
touch jest.config.js
```

Created test files:
- `src/__tests__/movie.test.ts`
- `src/__tests__/health.test.ts`

## 15. Documentation

Created `README.md` with:
- Project overview
- Installation instructions
- API documentation
- Project structure

## 16. Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start

# Run tests
npm test

# Seed database
npm run seed
```

## 17. API Documentation with Swagger

```bash
# Install Swagger dependencies
npm install swagger-ui-express swagger-jsdoc --save
npm install @types/swagger-ui-express @types/swagger-jsdoc --save-dev
```

Created `src/config/swagger.ts` with:
- OpenAPI specification configuration
- API information and server details
- Schema definitions for models
- Response definitions for common HTTP responses

Updated routes and controllers with JSDoc annotations for Swagger:
- Added `@swagger` annotations to document endpoints
- Defined request parameters, request bodies, and responses
- Grouped endpoints by tags for better organization

Integrated Swagger UI into the Express application in `src/index.ts`:
- Added middleware to serve Swagger UI at `/api-docs`
- Added endpoint to serve Swagger JSON at `/swagger.json`
- Updated root endpoint to include links to documentation

### Accessing Swagger Documentation

- **Swagger UI**: Available at `http://localhost:3000/api-docs`
  - Interactive documentation with a user-friendly interface
  - Test API endpoints directly from the browser
  - View request/response schemas and examples

- **Swagger JSON**: Available at `http://localhost:3000/swagger.json`
  - Raw OpenAPI specification in JSON format
  - Can be imported into API tools like Postman

### Extending Swagger Documentation

To document new endpoints:
1. Add JSDoc comments with `@swagger` annotations above route handlers
2. Follow the OpenAPI 3.0 specification format
3. Reference existing schemas or create new ones as needed
4. Group related endpoints using tags

Example annotation:
```javascript
/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [ResourceGroup]
 *     parameters:
 *       - name: paramName
 *         in: query
 *         description: Parameter description
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceSchema'
 */
```

## 18. Docker and Docker Compose Setup

This application can be run in Docker containers using Docker Compose, which allows for easy scaling and load balancing.

### Docker Setup

The project includes:
- A `Dockerfile` for building the Node.js application image
- An Nginx configuration file for load balancing
- A `docker-compose.yml` file to orchestrate multiple containers

### Building and Running with Docker Compose

```bash
# Build and start all containers in detached mode
docker-compose up -d

# View logs from all containers
docker-compose logs -f

# View logs from a specific container
docker-compose logs -f app1

# Stop all containers
docker-compose down

# Stop all containers and remove volumes
docker-compose down -v
```

### Container Structure

The Docker Compose setup includes:
- 3 instances of the Node.js application (app1, app2, app3)
- 1 Nginx container acting as a load balancer
- 1 MongoDB container for the database

### Testing the Load Balancer

You can test that the load balancer is working by accessing the application through Nginx:

```bash
# Make multiple requests to the API
curl http://localhost/health

# Each request should be routed to a different application instance
# You can verify this by checking the logs
docker-compose logs -f
```

A test script is included to help verify the load balancing functionality:

```bash
# Make the script executable
chmod +x test-load-balancer.sh

# Run the test script
./test-load-balancer.sh
```

This script will:
1. Make continuous requests to the health endpoint
2. Display which container (app1, app2, or app3) handled each request
3. Show the round-robin load balancing in action

Example output:
```
Request 1:
Status: OK, Handled by: app1

Request 2:
Status: OK, Handled by: app2

Request 3:
Status: OK, Handled by: app3

Request 4:
Status: OK, Handled by: app1
```

You can also observe the load balancer in action by checking the Docker logs in another terminal:

```bash
docker-compose logs -f app1 app2 app3
```

The health endpoint has been enhanced to include the container's hostname in the response, making it easy to see which instance is handling each request.

### Starting the Web Application

To start the web application along with all its components (API, database, load balancer), follow these steps:

```bash
# Build and start all containers in detached mode
docker-compose up -d

# Check if all containers are running
docker-compose ps
```

This will start:
- 3 instances of the Node.js application
- 1 MongoDB database
- 1 Nginx load balancer

The web application will be accessible through the Nginx load balancer, which distributes requests across the three application instances.

### Accessing the Application

- **Web Application**: http://localhost
- **Movie Detail Page**: http://localhost/movie.html?id=[movie_id]
- **API**: http://localhost/api/movies
- **Swagger UI**: http://localhost/api-docs
- **Health Check**: http://localhost/health

### Individual Application Instances

You can also access each application instance directly:
- Instance 1: http://localhost:3001
- Instance 2: http://localhost:3002
- Instance 3: http://localhost:3003

### Scaling the Application

You can scale the application to have more or fewer instances:

```bash
# Scale to a different number of instances (not recommended with this setup)
# This would require modifying the nginx.conf file
```

## 19. Final Project Structure

```
Lupisori_web/
├── src/
│   ├── config/         # Configuration files
│   │   ├── database.ts
│   │   └── swagger.ts  # Swagger configuration
│   ├── controllers/    # Request handlers
│   │   ├── healthController.ts
│   │   └── movieController.ts
│   ├── models/         # Database models
│   │   └── movieModel.ts
│   ├── routes/         # API routes
│   │   └── movieRoutes.ts
│   ├── services/       # Business logic
│   │   └── movieService.ts
│   ├── utils/          # Utility functions
│   │   └── seeder.ts
│   ├── __tests__/      # Test files
│   │   ├── health.test.ts
│   │   └── movie.test.ts
│   └── index.ts        # Application entry point
├── nginx/              # Nginx configuration
│   └── nginx.conf      # Load balancer configuration
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker image definition
├── jest.config.js      # Jest configuration
├── package.json        # Project dependencies
├── README.md           # Project documentation
├── SETUP.md            # This setup guide
└── tsconfig.json       # TypeScript configuration
```
