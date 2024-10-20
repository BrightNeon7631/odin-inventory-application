const { Router } = require('express');
const moviesController = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', moviesController.getAllMovies);
moviesRouter.get('/new', moviesController.createNewMovieForm);
moviesRouter.post('/new', moviesController.createNewMoviePost);
moviesRouter.get('/:id', moviesController.getMovieByID);
moviesRouter.get('/:id/edit', moviesController.editMovieForm);
moviesRouter.post('/:id/edit', moviesController.editMoviePost);
moviesRouter.get('/:id/delete', moviesController.deleteMovieForm);
moviesRouter.post('/:id/delete', moviesController.deleteMoviePost);

module.exports = moviesRouter;