import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/movieModel';
import { connectDB, closeDB } from '../config/database';

// Load environment variables
dotenv.config();

/**
 * Test movie retrieval from the database
 */
const testMovieRetrieval = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/develop-CCP30-content-de';

    // Connect to MongoDB
    await connectDB(mongoUri);

    // Fetch movies from the database
    const movies = await Movie.find().limit(5);

    console.log(`Found ${movies.length} movies`);

    if (movies.length > 0) {
      console.log('First movie details:');
      console.log(JSON.stringify(movies[0], null, 2));
    } else {
      console.log('No movies found in the database');
    }

    // Close connection
    await closeDB();
    console.log('Test completed');

    process.exit(0);
  } catch (error) {
    console.error('Error testing movie retrieval:', error);
    process.exit(1);
  }
};

// Run the test
testMovieRetrieval();
