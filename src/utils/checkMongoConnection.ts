import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/movieModel';
import { connectDB, closeDB } from '../config/database';
import { Schema, Document } from 'mongoose';

// Define a type for movie objects that may come from different collections
interface MovieLike {
  id?: string;
  _id?: any;
  title?: string;
  type?: string;
  releaseYear?: number;
  genres?: Array<{title: string} | string>;
  duration?: number;
  collection?: string;
}

// Load environment variables
dotenv.config();

/**
 * Check MongoDB connection and collection access
 */
const checkMongoConnection = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/develop-CCP30-content-de';

    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);

    // Connect to MongoDB with retry mechanism
    await connectDB(mongoUri, 5, 5000);

    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Check if movies collection exists
    const hasMovieCollection = collections.some(collection => collection.name === 'movies');
    console.log(`movies collection exists: ${hasMovieCollection}`);

    // Fetch all movies from the movies collection
    const activeMovies = await Movie.find();
    console.log(`Found ${activeMovies.length} movies in the movies collection`);

    // Create a temporary model for the 'movie_active' collection (for backward compatibility check)
    const MoviesTempSchema = new Schema({}, { strict: false });
    const MoviesTemp = mongoose.model<Document>('MoviesTemp', MoviesTempSchema, 'movie_active');

    // Fetch all movies from the movie_active collection (for backward compatibility check)
    const regularMovies = await MoviesTemp.find();
    console.log(`Found ${regularMovies.length} movies in the movie_active collection (legacy)`);

    // Combine both results and convert to MovieLike type
    const activeMoviesConverted = activeMovies.map(movie => {
      const movieObj: MovieLike = {
        id: movie.id,
        _id: movie._id,
        title: movie.title,
        type: movie.type,
        releaseYear: movie.releaseYear,
        genres: movie.genres,
        duration: movie.duration,
        collection: 'movies'
      };
      return movieObj;
    });

    const regularMoviesConverted = regularMovies.map(movie => {
      const movieDoc = movie as any;
      const movieObj: MovieLike = {
        id: movieDoc.id,
        _id: movieDoc._id,
        title: movieDoc.title,
        type: movieDoc.type,
        releaseYear: movieDoc.releaseYear,
        genres: movieDoc.genres,
        duration: movieDoc.duration,
        collection: 'movie_active'
      };
      return movieObj;
    });

    const allMovies: MovieLike[] = [...activeMoviesConverted, ...regularMoviesConverted];

    if (allMovies.length > 0) {
      console.log('Listing all movies:');
      allMovies.forEach((movie, index) => {
        console.log(`\n--- Movie ${index + 1} ---`);
        console.log(`ID: ${movie.id || movie._id || 'N/A'}`);
        console.log(`Title: ${movie.title || 'N/A'}`);
        console.log(`Type: ${movie.type || 'N/A'}`);
        console.log(`Release Year: ${movie.releaseYear || 'N/A'}`);
        console.log(`Genres: ${movie.genres ? movie.genres.map((g: any) => g.title || g).join(', ') : 'N/A'}`);
        console.log(`Duration: ${movie.duration ? `${movie.duration} minutes` : 'N/A'}`);
        console.log(`Collection: ${movie.collection || 'N/A'}`);
      });
    } else {
      console.log('No movies found in either collection');
    }

    // Close connection
    await closeDB();
    console.log('Test completed');

    process.exit(0);
  } catch (error) {
    console.error('Error checking MongoDB connection:', error);
    process.exit(1);
  }
};

// Run the check
checkMongoConnection();
