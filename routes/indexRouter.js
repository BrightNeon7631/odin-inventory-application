const { Router } = require('express');
const indexController = require('../controllers/indexController');

const indexRouter = Router();

indexRouter.get('/', indexController.renderIndexPage);

module.exports = indexRouter;