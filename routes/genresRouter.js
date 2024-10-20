const { Router } = require('express');
const genresController = require('../controllers/genresController');

const genresRouter = Router();

genresRouter.get('/', genresController.getAllGenres);
genresRouter.get('/new', genresController.createNewGenreForm);
genresRouter.post('/new', genresController.createNewGenrePost);
genresRouter.get('/:id', genresController.getGenreByID);
genresRouter.get('/:id/edit', genresController.editGenreForm);
genresRouter.post('/:id/edit', genresController.editGenrePost);
genresRouter.get('/:id/delete', genresController.deleteGenreForm);
genresRouter.post('/:id/delete', genresController.deleteGenrePost);

module.exports = genresRouter;