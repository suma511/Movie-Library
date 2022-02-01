'use strict' ;
require('dotenv').config() ;
const express = require('express') ;
const cors = require('cors') ;
const axios =require('axios') ;
const { request } = require('express');
const server = express() ;
server.use(cors());

let PORT = process.env.PORT || 3001;
console.log(PORT);
let numberOfMovie  =5 ;
let url =`${process.env.API_URL}?api_key=${process.env.APIKEY}&language=en-US` ;
//let url ="https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US" ;
console.log(url);
let userSearch = "Spider-Man: No Way Home";
let vote_average = 5.6;
//let moviesdata = require('./task11/data.json');
//const { process } = require('ipaddr.js');

server.get('/',handelHomePage);
server.get('/favorite',handelFavoritePage);
server.get('/trending',handelTrending);
server.get('/search',handelSearching);
server.use('*',handelNotFound);
server.use(errorHandler);

function Data (title, posterpath , overview )
{
    this.title =title ;
    this.posterpath =posterpath ;
    this.overview =overview ;

}



function Trend (id,title,poster_path,overview,release_date){
    this.id =id ;
    this.title=title;
    this.poster_path =poster_path ;
    this.overview =overview ;
    this.release_date=release_date;
}



function handelTrending (request,response){
    let newArr = [];
    axios.get(url).then((result)=>{
       // console.log(result.data);
        //console.log(result.data.results);
            result.data.results.forEach(trend =>{
            newArr.push(new Trend(trend.id,trend.title,trend.poster_path,trend.overview,trend.release_date));
        })
        console.log(newArr);
        response.status(200).json(newArr);


    }).catch((err)=>{
        errorHandler(err,request,response);

    })
}
  

function handelSearching (req,res){
    let url =`${process.env.API_URL}?api_key=${process.env.APIKEY}&language=en-US&{numberOfMovie}&query=${userSearch}&{vote_average}`;

    axios.get(url)
    .then(result=>{
        
        let trends = result.data.trends.map(trend =>{
            return new trend(trend.id,trend.title,trend.poster_path,trend.overview,trend.release_date);
        });
        res.status(200).json(trends);  
     }).catch((err)=>{
        errorHandler(err,req,res);

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



function errorHandler (error,req,res){
    const err = {
        status : 500,
        message : error
    }
    res.status(500).send(err);

}

server.listen(PORT,()=>{
    console.log(`listining to port ${PORT}`);
});