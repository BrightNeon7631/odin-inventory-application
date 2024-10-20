const express = require('express');
const path = require('node:path');
require('dotenv').config();
const indexRouter = require('./routes/indexRouter');
const moviesRouter = require('./routes/moviesRouter');
const genresRouter = require('./routes/genresRouter');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/movies', moviesRouter);
app.use('/genres', genresRouter);
app.use('*', (req, res) => {
    res.render('error', { error: '404 - Page not found.' });
});

// Error handling
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).render('error', { error: err.message });
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));