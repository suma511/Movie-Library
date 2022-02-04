DROP TABLE IF EXISTS MoviesTable;
CREATE TABLE MoviesTable(

     id SERIAL PRIMARY KEY,
     title VARCHAR(255),
     poster_path VARCHAR(255),
      overview VARCHAR(4000),
     release_date VARCHAR(255)
     
);
