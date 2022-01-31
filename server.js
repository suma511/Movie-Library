'use strict' ;
const express = requier('express') ;
const cors = requier('cors') ;
const server = express() ;
server.use(cors());


let moviesdata = requier('./task11/data.json')
server.get('*',handelNotFound);
server.get('/',handelHomePage);
server.get('*',handelNotFound);
server.get('/favorite',handelFavoritePage)


function data (title, posterpath , overview )
{
    this.title =title ;
    this.posterpath =posterpath ;
    this.overview =overview ;

}

function handelHomePage(request,response)
{
let obj = new data(moviesdata.title,moviesdata.posterpath,moviesdata.overview) ;
console.log(data) ;
return response.status(200).json(data) ;}



function handelFavoritePage(request,response){
    return response.status(200).("Welcome to Favorite Page") ;
}



function handelNotFound(request,response)
response.status(404).send('this page not exist')



function handelError(request,response)
response.status(500).send('server error')


server.listen(3000),() =>
{console.log("hello"); 
}
