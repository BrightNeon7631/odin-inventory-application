const db = require('../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const CustomNotFoundError = require ('../utils/CustomNotFoundError');
require('dotenv').config();

const validateMovie = [
    body('movieTitle')
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters.'),
    body('description')
      .isLength({ min: 1, max: 255 })
      .withMessage('Description must be between 1 and 255 characters.'),
    body('director')
      .isLength({ min: 1, max: 100 })
      .withMessage('Director name must be between 1 and 100 characters.'),
    body('imageUrl')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Image URL cannot be longer than 255 characters.'),
    body('releaseDate')
      .isISO8601('yyyy-mm-dd')
      .withMessage('Release date must be in the correct format: yyyy-mm-dd.'),
    body('price')
      .isFloat()
      .withMessage('Price must be a number.')
];

const getAllMovies = asyncHandler(async (req, res) => {
    const movies = await db.queryGetAllMovies();
    res.render('movieAll', { movies: movies });
});

const getMovieByID = asyncHandler(async (req, res) => {
    const movieID = req.params.id;
    const movie = await db.queryGetMovieByID(movieID);

    // successful db query results in an array with just one object
    if (!movie[0]) {
        throw new CustomNotFoundError(`404 - Movie with id: ${movieID} wasn't found.`);
    }

    res.render('movie', { movie: movie[0] });
});

const createNewMovieForm = asyncHandler(async (req, res) => {
    const genres = await db.queryGetAllGenres();
    if (genres.length < 1) {
        throw new CustomNotFoundError(`404 - No genre was found. Add at least one first.`);
    }
    res.render('movieAddForm', { genres: genres });
});

const createNewMoviePost = [
    validateMovie,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genres = await db.queryGetAllGenres();
            return res.status(400).render('movieAddForm', { 
                errors: errors.array(), 
                genres: genres 
            });
        }
        const currentDate = new Date().toISOString().split('T')[0];
        const { movieTitle, description, director, releaseDate, price, imageUrl, genreId } = req.body;
        await db.queryAddNewMovie(movieTitle, description, director, releaseDate, price, currentDate, imageUrl, genreId);
        res.redirect('/movies');
    }),
];

const deleteMovieForm = asyncHandler(async (req, res) => {
    const movieID = req.params.id;
    const movie = await db.queryGetMovieByID(movieID);
    if (!movie[0]) {
        throw new CustomNotFoundError(`404 - Movie with id: ${movieID} wasn't found.`);
    }
    res.render('movie', { movie: movie[0], confirm: true });
});

const deleteMoviePost = asyncHandler(async (req, res) => {
    const { confirmPassword } = req.body;
    const movieID = req.params.id;
    if (confirmPassword === process.env.PASSWORD) {
        await db.queryDeleteMovie(movieID);
        res.redirect('/movies');
    } else {
        const movie = await db.queryGetMovieByID(movieID);
        res.render('movie', { movie: movie[0], confirm: true, errors: [{ msg: 'Incorrect password.' }] });
    }
});

const editMovieForm = asyncHandler(async (req, res) => {
    const movieID = req.params.id;
    const genres = await db.queryGetAllGenres();
    const movie = await db.queryGetMovieByID(movieID);
    if (!movie[0]) {
        throw new CustomNotFoundError(`404 - Movie with id: ${movieID} wasn't found.`);
    }
    res.render('movieEditForm', { movie: movie[0], genres: genres });
});

const editMoviePost = [
    validateMovie,
    asyncHandler(async (req, res) => {
        const movieID = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genres = await db.queryGetAllGenres();
            const movie = await db.queryGetMovieByID(movieID);
            return res.status(400).render('movieEditForm', { 
                errors: errors.array(), 
                genres: genres,
                movie: movie
            });
        }
        const { movieTitle, description, director, releaseDate, price, imageUrl, genreId } = req.body;
        await db.queryEditMovie(movieTitle, description, director, releaseDate, price, imageUrl, genreId, movieID);
        res.redirect('/movies'); 
    }),
];

module.exports = {
    getAllMovies,
    getMovieByID,
    createNewMovieForm,
    createNewMoviePost,
    deleteMovieForm,
    deleteMoviePost,
    editMovieForm,
    editMoviePost
}