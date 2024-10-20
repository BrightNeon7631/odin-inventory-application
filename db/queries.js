const pool = require('./pool');

// MOVIES
async function queryGetAllMovies() {
    const query = `
    SELECT movies.id, movies.title, movies.description, movies.director, movies.release_date, movies.price, movies.created_on, movies.image_url, genres.name
    FROM movies
    INNER JOIN genres
    ON movies.genre_id = genres.id
    ORDER BY movies.id
    `;
    const { rows } = await pool.query(query);
    return rows;
}

async function queryGetMovieByID(id) {
    const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    return rows;
}

async function queryGetMoviesByGenre(genreID) {
    const query = `
    SELECT movies.id, movies.title, movies.description, movies.director, movies.release_date, movies.price, movies.created_on, movies.image_url, genres.name
    FROM movies
    INNER JOIN genres
    ON movies.genre_id = genres.id
    WHERE genres.id = $1
    `;
    const { rows } = await pool.query(query, [genreID]);
    return rows;
}

async function queryAddNewMovie(title, description, director, releaseDate, price, createdOn, imageUrl, genreId) {
    const query = `
    INSERT INTO movies (title, description, director, release_date, price, created_on, image_url, genre_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(query, [title, description, director, releaseDate, price, createdOn, imageUrl, genreId]);
}

async function queryEditMovie(title, description, director, releaseDate, price, imageUrl, genreId, movieIdToEdit) {
    const query = `
    UPDATE movies
    SET title = $1, description = $2, director = $3, release_date = $4, price = $5, image_url = $6, genre_id = $7
    WHERE id = $8
    `;
    await pool.query(query, [title, description, director, releaseDate, price, imageUrl, genreId, movieIdToEdit]);
}

async function queryDeleteMovie(movieID) {
    const query = `
    DELETE FROM movies
    WHERE id = $1
    `;
    await pool.query(query, [movieID]);
}

// GENRES
async function queryGetAllGenres() {
    const { rows } = await pool.query('SELECT * FROM genres ORDER BY id');
    return rows;
}

async function queryGetGenreByID(id) {
    const { rows } = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
    return rows;
}

async function queryAddNewGenre(name, description) {
    const query = `
    INSERT INTO genres (name, description)
    VALUES
    ($1, $2)
    `;
    await pool.query(query, [name, description]);
}

async function queryEditGenre(name, description, genreIdToEdit) {
    const query = `
    UPDATE genres 
    SET name = $1, description = $2
    WHERE id = $3
    `;
    await pool.query(query, [name, description, genreIdToEdit]);
}

async function queryDeleteGenre(genreID) {
    const query = `
    DELETE FROM genres
    WHERE id = $1
    `;
    await pool.query(query, [genreID]);
}

module.exports = {
    queryGetAllMovies,
    queryGetMovieByID,
    queryGetMoviesByGenre,
    queryAddNewMovie,
    queryEditMovie,
    queryDeleteMovie,
    queryGetAllGenres,
    queryGetGenreByID,
    queryAddNewGenre,
    queryEditGenre,
    queryDeleteGenre
}