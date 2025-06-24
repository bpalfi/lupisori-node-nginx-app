import { Request, Response } from 'express';
import { MovieService } from '../services/movieService';
import mongoose from 'mongoose';

/**
 * MovieController class for handling HTTP requests related to movies
 * @class MovieController
 */
export class MovieController {
  private movieService: MovieService;

  /**
   * Creates an instance of MovieController
   * @constructor
   */
  constructor() {
    this.movieService = new MovieService();
  }

  /**
   * Get all movies with pagination
   * @param req - Express request object
   * @param res - Express response object
   */
  getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      // Parse query parameters for pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = req.query.sort as string || '-createdAt';

      // Get paginated movies from service
      const result = await this.movieService.getMovies({ page, limit, sort });

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error getting movies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve movies',
        error: (error as Error).message
      });
    }
  };

  /**
   * Get a movie by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Validate MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
        return;
      }

      const movie = await this.movieService.getMovieById(id);

      if (!movie) {
        res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: movie
      });
    } catch (error) {
      console.error('Error getting movie by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve movie',
        error: (error as Error).message
      });
    }
  };

  /**
   * Create a new movie
   * @param req - Express request object
   * @param res - Express response object
   */
  createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const movie = await this.movieService.createMovie(req.body);

      res.status(201).json({
        success: true,
        message: 'Movie created successfully',
        data: movie
      });
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create movie',
        error: (error as Error).message
      });
    }
  };

  /**
   * Update a movie
   * @param req - Express request object
   * @param res - Express response object
   */
  updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Validate MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
        return;
      }

      const movie = await this.movieService.updateMovie(id, req.body);

      if (!movie) {
        res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Movie updated successfully',
        data: movie
      });
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update movie',
        error: (error as Error).message
      });
    }
  };

  /**
   * Delete a movie
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Validate MongoDB ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid movie ID format'
        });
        return;
      }

      const movie = await this.movieService.deleteMovie(id);

      if (!movie) {
        res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Movie deleted successfully',
        data: movie
      });
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete movie',
        error: (error as Error).message
      });
    }
  };
}
