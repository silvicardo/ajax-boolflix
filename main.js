/**********************************************/
/**********************************************/
/****** PROGETTO: ajax-boolflix - main.js *****/
/**********************************************/
/**********************************************/

/*
themoviedb- API
API KEY : e84c7d2ede59ead3397581c0ad7d4dec
TEST URL : https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
Required params: api-key, query(String)
*/

/*****************************/
/******** PROGRAMMA **********/
/*****************************/

$(document).ready(function () {
  console.log('welcome to ajax-BoolFlix');

  var stringaRicercata = 'Fantozzi';

  var lingue = [
                { nome: 'Italiano', codice: 'it-IT' },
                { nome: 'Inglese', codice: 'en-US' },
                ];

  var apiParameters = {
    urlBase: 'https://api.themoviedb.org/3/search/movie',
    data: {
      api_key: 'e84c7d2ede59ead3397581c0ad7d4dec',
      language: lingue[0].codice,
      query: stringaRicercata,
    },
  };

  $.ajax({
    url: apiParameters.urlBase,
    method: 'GET',
    data: apiParameters.data,
    success: function (apiData) {
      console.log(apiData.results);
    },
    error: function(error){
      console.log('Error retrieving data');
    },
  });

});

/**********************************/
/*************FUNZIONI*************/
/**********************************/
