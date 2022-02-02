'use strict' ;
require('dotenv').config() ;
const express = require('express') ;
const cors = require('cors') ;
const axios =require('axios') ;
const { request } = require('express');
const server = express() ;
server.use(cors());
const pg =require('pg');
const { process } = require('ipaddr.js');
const { Client } = require('pg');

let PORT = process.env.PORT || 3001;
console.log(PORT);
let numberOfMovies  =5 ;
let url =`${process.env.API_URL}?api_key=${process.env.APIKEY}&language=en-US` ;
//let url ="https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US" ;
console.log(url);
let userSearch = "Spider-Man:No Way Home";
let vote_average = 5.6;
const client = new pg.Client(process.env.DATABASE_URL);
//let moviesdata = require('./task11/data.json');
//const { process } = require('ipaddr.js');

server.get('/',handelHomePage);
server.get('/favorite',handelFavoritePage);
server.get('/trending',handelTrending);
server.get('/search',handelSearching);
server.use('*',handelNotFound);
server.use(errorHandler);
server.post('/addFavMovie',favMovieHandler);
server.get('/getMovies',getFavMovieHandler);

function Data (title, posterpath , overview )
{
    this.title =title ;
    this.posterpath =posterpath ;
    this.overview =overview ;

}



function Movies (id,title,poster_path,overview,release_date){
    this.id =id ;
    this.title=title;
    this.poster_path =poster_path ;
    this.overview =overview ;
    this.release_date=release_date;
}

function favMovieHandler(request,response){
    const moviee =request.body;
    let sql =`INSERT IN TO Movies(title,poster_path,overview,release_date)VALUES($1,$2,$3,$4)RETURNING;`
let VALUES = [moviee.title,moviee.poster_path,moviee.overview,moviee.release_date];
client.query(sql,values).then(data=>{
    response.status(200).json(data.rows);
}).catch(error=>{errorHandler(err,request,response)});

function getFavMovieHandler(request,response){
    let sql=`SELECT * FROM Movies;` ;
    client.query(sql).then(data=>{
        response.status(200).json(data.rows);
    })
}

}

function handelTrending (request,response){
    let newArr = [];
    axios.get(url).then((result)=>{
       // console.log(result.data);
        //console.log(result.data.results);
            result.data.results.forEach(trend =>{
            newArr.push(new Movies(movies.id,movies.title,movies.poster_path,movies.overview,movies.release_date));
        })
        console.log(newArr);
        response.status(200).json(newArr);


    }).catch((err)=>{
        errorHandler(err,request,response);

    })
}
  

function handelSearching (request,response){
    let url =`${process.env.API_URL}?api_key=${process.env.APIKEY}&query=${userSearch}`;
let userSearch =request.query.userSearch;
    axios.get(url)
    .then(result=>{
        
        let movies = result.data.results.map(trend =>{
            return new movies(movies.id,movies.title,movies.poster_path,movies.overview,movies.release_date);
        });
        response.status(200).json(movies); 

     }).catch((err)=>{
        errorHandler(err,request,response);

    })
}

function handelHomePage(request,response)
{
let obj = new Data(moviesdata.title,moviesdata.poster_path,moviesdata.overview) ;
console.log(obj) ;
return response.status(200).json(obj) ;}



function handelFavoritePage(request,response){
    return response.status(200).send("Welcome to Favorite Page") ;
}



function handelNotFound(request,response){
response.status(404).send('this page not exist')}



function errorHandler (error,request,response){
    const err = {
        status : 500,
        message : error
    }
    response.status(500).send(err);

}
client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`);
    });
});
