DROP TABLE IF EXISTS Movies;
CREATE TABLE Movies(

     id SERIAL PRIMARY KEY,
     title VARCHAR(255),
     release_date VARCHAR(255),
     poster VARCHAR(1000),
     overview VARCHAR(1000),
     comment VARCHAR(255)

)
