const db = require('../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const CustomNotFoundError = require ('../utils/CustomNotFoundError');
require('dotenv').config();

const validateGenre = [
    body('genreName')
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters.'),
    body('description')
      .isLength({ min: 1, max: 255 })
      .withMessage('Description must be between 1 and 255 characters.'),
];

const getAllGenres = asyncHandler(async (req, res) => {
    const genres = await db.queryGetAllGenres();
    res.render('genreAll', { genres: genres });
});

// plus gets movies in this genre
const getGenreByID = asyncHandler(async (req, res) => {
    const genreID = req.params.id;
    const genre = await db.queryGetGenreByID(genreID);
    const movies = await db.queryGetMoviesByGenre(genreID);

    if (!genre[0]) {
        throw new CustomNotFoundError(`404 - Genre with id: ${genreID} wasn't found.`);
    }

    res.render('genre', { genre: genre[0], movies: movies });
});

const createNewGenreForm = (req, res) => {
    res.render('genreAddForm');
}

const createNewGenrePost = [
    validateGenre,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('genreAddForm', { errors: errors.array()});
        }
        const { genreName, description } = req.body;
        await db.queryAddNewGenre(genreName, description);
        res.redirect('/genres');
    }),
];

const deleteGenreForm = asyncHandler(async (req, res) => {
    const genreID = req.params.id;
    const genre = await db.queryGetGenreByID(genreID);
    const movies = await db.queryGetMoviesByGenre(genreID);
    if (!genre[0]) {
        throw new CustomNotFoundError(`404 - Genre with id: ${genreID} wasn't found.`);
    }
    res.render('genre', { genre: genre[0], movies: movies, confirm: true });
});

const deleteGenrePost = asyncHandler(async (req, res) => {
    const { confirmPassword } = req.body;
    const genreID = req.params.id;
    if (confirmPassword === process.env.PASSWORD) {
        await db.queryDeleteGenre(genreID);
        res.redirect('/genres');
    } else {
        const genre = await db.queryGetGenreByID(genreID);
        const movies = await db.queryGetMoviesByGenre(genreID);
        res.render('genre', { genre: genre[0], movies: movies, confirm: true, errors: [{ msg: 'Incorrect password.' }] });
    }
});

const editGenreForm = asyncHandler(async (req, res) => {
    const genreID = req.params.id;
    const genre = await db.queryGetGenreByID(genreID);
    if (!genre[0]) {
        throw new CustomNotFoundError(`404 - Genre with id: ${genreID} wasn't found.`);
    }
    res.render('genreEditForm', { genre: genre[0] });
});

const editGenrePost = [
    validateGenre,
    asyncHandler(async (req, res) => {
        const genreID = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genre = await db.queryGetGenreByID(genreID);
            return res.status(400).render('genreEditForm', { 
                errors: errors.array(), 
                genre: genre,
            });
        }
        const { genreName, description } = req.body;
        await db.queryEditGenre(genreName, description, genreID);
        res.redirect('/genres'); 
    }),
];

module.exports = {
    getAllGenres,
    getGenreByID,
    createNewGenreForm,
    createNewGenrePost,
    deleteGenreForm,
    deleteGenrePost,
    editGenreForm,
    editGenrePost
}