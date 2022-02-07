DROP TABLE IF EXISTS MoviesTable;

CREATE TABLE MoviesTable(

     id SERIAL PRIMARY KEY,
     title VARCHAR(255),
     poster_path VARCHAR(255),
<<<<<<< HEAD
     overview VARCHAR(4000)
=======
      overview VARCHAR(4000),
     release_date VARCHAR(255)
>>>>>>> 5b3e6d922e0874d642ad0246f955b73845caebe8
     
);
