# Movies API

A RESTful API for managing movie data built with Node.js, Express, TypeScript, and MongoDB.

## Features

- RESTful API endpoints for CRUD operations on movies
- TypeScript for type safety and better developer experience
- MongoDB integration with Mongoose ODM
- Pagination support for listing movies (both API and frontend)
- Responsive web interface with movie cards
- Comprehensive error handling
- Environment-based configuration
- Sample data seeder

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Lupisori_web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string and other settings.

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server in development mode with hot reloading.

### Production Mode

```bash
npm run build
npm start
```

This will compile the TypeScript code and start the server.

### Seeding the Database

To populate the database with sample movie data:

```bash
npm run seed
```

## API Endpoints

### Movies

- `GET /api/movies` - Get all movies (with pagination)
  - Query parameters:
    - `page` (default: 1) - Page number
    - `limit` (default: 10) - Number of items per page
    - `sort` (default: -createdAt) - Sort criteria

- `GET /api/movies/:id` - Get a movie by ID

- `POST /api/movies` - Create a new movie
  - Request body:
    ```json
    {
      "title": "Movie Title",
      "director": "Director Name",
      "year": 2023,
      "genre": ["Action", "Drama"],
      "rating": 8.5,
      "description": "Movie description"
    }
    ```

- `PUT /api/movies/:id` - Update a movie
  - Request body: Same as POST, but fields are optional

- `DELETE /api/movies/:id` - Delete a movie

## Web Interface

The application includes a responsive web interface for browsing movies:

- Home page (`/index.html`) displays a grid of movie cards
- Pagination controls allow navigation through the movie collection
- Movie detail page (`/movie.html?id=<movie-id>`) shows detailed information about a specific movie

### Pagination Features

- Navigate through pages using Previous/Next buttons
- Jump directly to specific pages using page number buttons
- Visual indication of current page
- Automatic adjustment of visible page numbers for large collections
- Display of current range and total number of movies
- Smooth scrolling when changing pages
- URL parameter support for direct access to specific pages

## Project Structure

```
Lupisori_web/
├── src/                # Backend source code
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── public/             # Frontend assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── images/         # Image assets
│   ├── index.html      # Home page
│   └── movie.html      # Movie detail page
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Run the application in development mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database with sample data

## License

MIT
