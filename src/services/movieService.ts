import { Movie, IMovie } from '../models/movieModel';

/**
 * Interface for pagination options
 * @interface PaginationOptions
 */
interface PaginationOptions {
  /** The page number (1-based) */
  page: number;
  /** The number of items per page */
  limit: number;
  /** Optional sorting criteria */
  sort?: string;
}

/**
 * Interface for pagination result
 * @interface PaginationResult
 */
interface PaginationResult<T> {
  /** The current page number */
  page: number;
  /** The number of items per page */
  limit: number;
  /** The total number of items */
  totalItems: number;
  /** The total number of pages */
  totalPages: number;
  /** The items for the current page */
  data: T[];
}

/**
 * MovieService class for handling movie-related business logic
 * @class MovieService
 */
export class MovieService {
  /**
   * Get all movies with pagination
   * @param options - Pagination options
   * @returns Promise with paginated movies
   */
  async getMovies(options: PaginationOptions): Promise<PaginationResult<IMovie>> {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const movies = await Movie.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalItems = await Movie.countDocuments();

    return {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: movies
    };
  }

  /**
   * Get a movie by ID
   * @param id - The movie ID
   * @returns Promise with the movie or null if not found
   */
  async getMovieById(id: string): Promise<IMovie | null> {
    return Movie.findById(id);
  }

  /**
   * Create a new movie
   * @param movieData - The movie data
   * @returns Promise with the created movie
   */
  async createMovie(movieData: Partial<IMovie>): Promise<IMovie> {
    const movie = new Movie(movieData);
    return movie.save();
  }

  /**
   * Update a movie
   * @param id - The movie ID
   * @param movieData - The updated movie data
   * @returns Promise with the updated movie or null if not found
   */
  async updateMovie(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
    return Movie.findByIdAndUpdate(id, movieData, { new: true, runValidators: true });
  }

  /**
   * Delete a movie
   * @param id - The movie ID
   * @returns Promise with the deleted movie or null if not found
   */
  async deleteMovie(id: string): Promise<IMovie | null> {
    return Movie.findByIdAndDelete(id);
  }
}
