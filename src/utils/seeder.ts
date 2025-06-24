import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/movieModel';
import { connectDB, closeDB } from '../config/database';

// Load environment variables
dotenv.config();

// Sample movie data
const sampleMovies = [
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    year: 1994,
    genre: ['Drama'],
    rating: 9.3,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    year: 1972,
    genre: ['Crime', 'Drama'],
    rating: 9.2,
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    year: 2008,
    genre: ['Action', 'Crime', 'Drama'],
    rating: 9.0,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    year: 1994,
    genre: ['Crime', 'Drama'],
    rating: 8.9,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    director: 'Peter Jackson',
    year: 2003,
    genre: ['Adventure', 'Drama', 'Fantasy'],
    rating: 8.9,
    description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.'
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    year: 1994,
    genre: ['Drama', 'Romance'],
    rating: 8.8,
    description: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    year: 2010,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 8.8,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    year: 1999,
    genre: ['Action', 'Sci-Fi'],
    rating: 8.7,
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    year: 1990,
    genre: ['Crime', 'Drama'],
    rating: 8.7,
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.'
  },
  {
    title: 'The Silence of the Lambs',
    director: 'Jonathan Demme',
    year: 1991,
    genre: ['Crime', 'Drama', 'Thriller'],
    rating: 8.6,
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.'
  }
];

/**
 * Seed the database with sample movie data
 */
const seedDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/develop-CCP30-content-de';

    // Connect to MongoDB
    await connectDB(mongoUri);

    // Clear existing data
    await Movie.deleteMany({});
    console.log('Existing movies deleted');

    // Insert sample data
    await Movie.insertMany(sampleMovies);
    console.log(`${sampleMovies.length} movies inserted`);

    // Close connection
    await closeDB();
    console.log('Database seeding completed');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
