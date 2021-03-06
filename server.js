'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const server = express();
server.use(cors());
server.use(express.json());
let PORT = process.env.PORT;
let url = `${process.env.API_URL}?api_key=${process.env.APIKEY}&language=en-US`;
//const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } })



server.get('/',handleHomePage);
server.get('/favorite', handelFavoritePage);
server.get('/trending', handelTrending);
server.get('/search', handelSearching);
server.post('/addFavMovie', favMovieHandler);
server.get('/getMovies', getFavMovieHandler);
server.put('/updateMovies/:id', updateMoviesHandler);
server.delete('/deleteMovies/:id', deleteMoviesHandler);
server.get('/getMoviesby/:id', getbyid);
server.use('*', handelNotFound);
server.use(errorHandler);


function Data(title, posterpath, overview) {
    this.title = title;
    this.posterpath = posterpath;
    this.overview = overview;

}

function Movies(id, title, poster_path, overview, release_date) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.release_date = release_date;
}

function handleHomePage(req,res){
    res.status(200).send("Welcome :) ");
}


function handelFavoritePage(request, response) {
    return response.status(200).send("Welcome to Favorite Page");
}

function handelTrending(request, response) {
    let newArr = [];
    axios.get(url)
        .then((result) => {
            result.data.results.forEach(movie => {
                newArr.push(new Movies(movie.id, movie.title, movie.poster_path, movie.overview, movie.release_date));
            })
            response.status(200).json(newArr);

        }).catch(error => {
            console.log(error);
        })

}

function handelSearching(request, response) {

    let userSearch = request.query.userSearch;
    let url = `${process.env.API_URL}?api_key=${process.env.APIKEY}&query=${userSearch}`;
 

    axios.get(url)
        .then(result => {
         
            let movies = result.data.results.map(movie => {
                return new Movies(movie.id, movie.title, movie.poster_path, movie.overview, movie.release_date);
               
            });
            response.status(200).json(movies);

        }).catch((err) => {
            errorHandler(err, request, response);

        })
}


function favMovieHandler(req, res) {
    const movie = req.body;
    console.log(req.body);
    let sql = `INSERT INTO MoviesTable(title,poster_path,overview,release_date) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values = [movie.title, movie.poster_path, movie.overview, movie.release_date];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}

function getFavMovieHandler(request, response) {
    let sql = `SELECT * FROM MoviesTable;`;
    client.query(sql).then(data => {
        response.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, request, response)
    });
}

function updateMoviesHandler(req, res) {
    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE MoviesTable SET title=$1,poster_path=$2,overview=$3,release_date=$4 WHERE id=$5 RETURNING *;`;
    let values = [movie.title, movie.poster_path, movie.overview, movie.release_date,id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);

    }).catch(error => {
        errorHandler(error, req, res)
    });
}

function getbyid(request, response) {
    const id = request.params.id;
    let sql = `SELECT * FROM MoviesTable WHERE id=${id};`;
    client.query(sql).then(data => {
        response.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, request, response)
    });

}

function deleteMoviesHandler(request, response) {
    const id = request.params.id;
    const sql = `DELETE FROM MoviesTable WHERE id=${id};`;
    client.query(sql).then(() => {
        response.status(200).send("The movie has been deleted");
    }).catch(error => {
        errorHandler(error, request, response)
    });
}

function errorHandler(error, request, response) {
    const err = {
        status: 500,
        message: error
    }
    response.status(500).send(err);

}

function handelNotFound(request, response) {
    response.status(404).send('this page not exist')
}

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    });
}).catch(error => {
    console.log(error);
})


