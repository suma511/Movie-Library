DROP TABLE IF EXISTS Movies;
CREATE TABLE MoviesTable(

     id SERIAL PRIMARY KEY,
     title VARCHAR(255),
     release_date VARCHAR(255),
     poster_path VARCHAR(255),
     overview VARCHAR(4000),
     

);
