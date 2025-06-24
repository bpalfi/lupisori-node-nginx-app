import mongoose from 'mongoose';
import { MovieService } from '../services/movieService';
import { Movie } from '../models/movieModel';

// Mock the Movie model
jest.mock('../models/movieModel');

describe('MovieService', () => {
  let movieService: MovieService;

  beforeEach(() => {
    jest.clearAllMocks();
    movieService = new MovieService();
  });

  afterAll(async () => {
    // Clean up any open connections
    await mongoose.connection.close();
  });

  describe('getMovies', () => {
    it('should return paginated movies', async () => {
      // Mock data
      const mockMovies = [
        {
          _id: '1',
          title: 'Test Movie 1',
          director: 'Test Director',
          year: 2020,
          genre: ['Action'],
          rating: 8.5
        },
        {
          _id: '2',
          title: 'Test Movie 2',
          director: 'Test Director 2',
          year: 2021,
          genre: ['Drama'],
          rating: 9.0
        }
      ];

      // Setup mocks
      (Movie.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockMovies)
          })
        })
      });

      (Movie.countDocuments as jest.Mock).mockResolvedValue(2);

      // Call the method
      const result = await movieService.getMovies({ page: 1, limit: 10 });

      // Assertions
      expect(Movie.find).toHaveBeenCalled();
      expect(Movie.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        page: 1,
        limit: 10,
        totalItems: 2,
        totalPages: 1,
        data: mockMovies
      });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by id', async () => {
      // Mock data
      const mockMovie = {
        _id: '1',
        title: 'Test Movie',
        director: 'Test Director',
        year: 2020,
        genre: ['Action'],
        rating: 8.5
      };

      // Setup mocks
      (Movie.findById as jest.Mock).mockResolvedValue(mockMovie);

      // Call the method
      const result = await movieService.getMovieById('1');

      // Assertions
      expect(Movie.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMovie);
    });

    it('should return null if movie not found', async () => {
      // Setup mocks
      (Movie.findById as jest.Mock).mockResolvedValue(null);

      // Call the method
      const result = await movieService.getMovieById('999');

      // Assertions
      expect(Movie.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      // Mock data
      const movieData = {
        title: 'New Movie',
        director: 'New Director',
        year: 2023,
        genre: ['Action'],
        rating: 8.0
      };

      const mockMovie = {
        ...movieData,
        _id: '3',
        save: jest.fn().mockResolvedValue({ ...movieData, _id: '3' })
      };

      // Setup mocks
      (Movie as unknown as jest.Mock).mockImplementation(() => mockMovie);

      // Call the method
      const result = await movieService.createMovie(movieData);

      // Assertions
      expect(Movie).toHaveBeenCalledWith(movieData);
      expect(mockMovie.save).toHaveBeenCalled();
      expect(result).toEqual({ ...movieData, _id: '3' });
    });
  });
});
