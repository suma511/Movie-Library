'use strict' ;
const express = require('express') ;
const cors = require('cors') ;
const server = express() ;
server.use(cors());


let moviesdata = require('./task11/data.json')
//server.get('*',handelNotFound);
server.get('/',handelHomePage);
server.get('/favorite',handelFavoritePage)
server.get('*',handelNotFound);

function Data (title, posterpath , overview )
{
    this.title =title ;
    this.posterpath =posterpath ;
    this.overview =overview ;

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



//function handelError(request,response)
//response.status(500).send('server error')

server.listen((3000,()=>{
    console.log("listining to port 3000")
}))

'use strict' ;
const express = require('express') ;
const cors = require('cors') ;
const server = express() ;
server.use(cors());


let moviesdata = require('./task11/data.json')
//server.get('*',handelNotFound);
server.get('/',handelHomePage);
server.get('/favorite',handelFavoritePage)
server.get('*',handelNotFound);

function Data (title, posterpath , overview )
{
    this.title =title ;
    this.posterpath =posterpath ;
    this.overview =overview ;

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



//function handelError(request,response)
//response.status(500).send('server error')

server.listen((3000,()=>{
    console.log("listining to port 3000")
}))

