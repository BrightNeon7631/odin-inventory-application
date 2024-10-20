#! /usr/bin/env node
const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS genres (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS movies (
    id INT GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    director VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_on DATE NOT NULL,
    image_url VARCHAR(255),
    genre_id INT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_genre
        FOREIGN KEY(genre_id) 
        REFERENCES genres(id)
        ON DELETE CASCADE
);

INSERT INTO genres (name, description)
VALUES
  ('Sport', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'),
  ('Sci-Fi', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'),
  ('Adventure', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.');

INSERT INTO movies (title, description, director, release_date, price, created_on, image_url, genre_id)
VALUES
  ('Rush', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Ron Howard', '2013-09-27', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/5akKFgS7eeXUw9rKTEujryKrH17.jpg', 1),
  ('Ford v Ferrari', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'James Mangold', '2019-11-15', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/dR1Ju50iudrOh3YgfwkAU1g2HZe.jpg', 1),
  ('Moneyball', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Bennett Miller', '2011-09-23', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/myRHYxfLpgwwRd13kcrRqxG6jAj.jpg', 1),
  ('Gran Turismo', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Neill Blomkamp', '2023-08-25', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/51tqzRtKMMZEYUpSYkrUE7v9ehm.jpg', 1),
  ('The Lord of the Rings: The Fellowship of the Ring', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Peter Jackson', '2001-12-19', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 3),
  ('The Hobbit: An Unexpected Journey', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Peter Jackson', '2012-12-14', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/yHA9Fc37VmpUA5UncTxxo3rTGVA.jpg', 3),
  ('Interstellar', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', 'Christopher Nolan', '2014-11-07', 19.99, '2024-08-21', 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 2);
`;

async function main() {
    console.log('start');
    const client = new Client({
        connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}

main();