import express from 'express';
import { MovieController } from '../controllers/movieController';

const router = express.Router();
const movieController = new MovieController();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies with pagination
 *     description: Retrieve a list of movies with pagination, sorting, and filtering options
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort criteria (prefix with - for descending order)
 *     responses:
 *       200:
 *         description: A paginated list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 10
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', movieController.getMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a single movie by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', movieController.getMovieById);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     description: Add a new movie to the database
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, director, year, genre, rating]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Shawshank Redemption"
 *               director:
 *                 type: string
 *                 example: "Frank Darabont"
 *               year:
 *                 type: integer
 *                 example: 1994
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Romance, Sci-Fi, Thriller, Western]
 *                 example: ["Drama"]
 *               rating:
 *                 type: number
 *                 example: 9.3
 *               description:
 *                 type: string
 *                 example: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', movieController.createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: Update an existing movie by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Romance, Sci-Fi, Thriller, Western]
 *               rating:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', movieController.updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Delete a movie by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', movieController.deleteMovie);

export default router;
