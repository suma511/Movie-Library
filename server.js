'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const server = express();
server.use(cors());
const pg = require('pg');
server.use(express.json());
let PORT = process.env.PORT;
let url = `${process.env.API_URL}?api_key=${process.env.APIKEY}&language=en-US`;
const client = new pg.Client(process.env.DATABASE_URL);




//server.get('/', handelHomePage);
server.get('/favorite', handelFavoritePage);
server.get('/trending', handelTrending);
server.get('/search', handelSearching);
server.post('/addFavMovie', favMovieHandler);
server.get('/getMovies', getFavMovieHandler);
server.use('*', handelNotFound);
// server.use(errorHandler);



function Data(title, posterpath, overview) {
    this.title = title;
    this.posterpath = posterpath;
    this.overview = overview;

}



function Movies(title,poster_path,overview,release_date) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.release_date = release_date;
}

function favMovieHandler(req, res) {
//     const movie = request.body;

//   let sql = `INSERT INTO MoviesTable(title,poster_path,overview,release_date) VALUES ($1,$2,$3,$4) RETURNING *;`
//   let values=[movie.title,movie.poster_path,movie.overview,movie.release_date];
//   client.query(sql,values).then(data =>{
//       response.status(200).json(data.rows);
//   }).catch(error=>{
//       errorHandler(error,request,response)
//   });
const movie = req.body;
  console.log(req.body);
  let sql = `INSERT INTO MoviesTable(title,poster_path,overview,release_date) VALUES ($1,$2,$3,$4) RETURNING *;`
  let values=[movie.title,movie.poster_path,movie.overview,movie.release_date];
  client.query(sql,values).then(data =>{
      res.status(200).json(data.rows);
  }).catch(error=>{
      errorHandler(error,req,res)
  });
}




    function getFavMovieHandler(request, response) {
        let sql = `SELECT * FROM MoviesTable;`;
        client.query(sql).then(data=>{
           response.status(200).json(data.rows);
        }).catch(error=>{
            errorHandler(error,request,response)
        });
    }



    function handelTrending(request,response) {
        let newArr = [];
    axios.get(url)
     .then((result)=>{
        result.data.results.forEach(movie =>{
            newArr.push(new Movies(movie.id,movie.title,movie.poster_path,movie.overview,movie.release_date));
        })
        response.status(200).json(newArr);

    }).catch(error=>{
        console.log(error);
    })

}


    function handelSearching (request,response){
        let userSearch ="Nightmare Alley";
        let url = `${process.env.API_URL}?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}` ;
        axios.get(url)
        .then(result=>{
           
            let movies = result.data.results.map(movie =>{
                return new Movies(movie.id,movie.title,movie.poster_path,movie.overview,movie.release_date);
            });
            response.status(200).json(movies);  
        }).catch(error=>{
            console.log(error);
        })
    
    }
    

    // function handelHomePage(request, response) {
    //     let obj = new Data(moviesdata.title, moviesdata.poster_path, moviesdata.overview);
    //     console.log(obj);
    //     return response.status(200).json(obj);
    // }



    function handelFavoritePage(request, response) {
        return response.status(200).send("Welcome to Favorite Page");
    }



    function handelNotFound(request, response) {
        response.status(404).send('this page not exist')
    }



    function errorHandler(error, request, response) {
        const err = {
            status: 500,
            message: error
        }
        response.status(500).send(err);

    }

    client.connect().then(() => {
        server.listen(PORT, () => {
            console.log(`listining to port ${PORT}`)
        });
    }).catch(error=>{
        console.log(error);
    })

