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

  var lingue = [
                { nome: 'Italiano', codice: 'it-IT' },
                { nome: 'Inglese', codice: 'en-US' },
                ];

  var apiParameters = {
    urlBase: 'https://api.themoviedb.org/3/search/movie',
    data: {
      api_key: 'e84c7d2ede59ead3397581c0ad7d4dec',
      language: lingue[0].codice,
      query: '',
    },
  };

  $('#bottoneCerca').click(function () {

    if ($('#inputRicerca').val() != '') {

      apiParameters.data.query = $('#inputRicerca').val();

      $.ajax({
        url: apiParameters.urlBase,
        method: 'GET',
        data: apiParameters.data,
        success: function (apiData) {
          $('#inputRicerca').val('');
          console.log('Hai cercato risultati per: ' + apiParameters.data.query);

          $('#lista_film .film').remove();

          for (var i = 0; i < apiData.results.length; i++) {

            var htmlTemplateFilm = $('#filmScript').html();
            var template = Handlebars.compile(htmlTemplateFilm);

            var data = {
              titolo: apiData.results[i].title,
              titoloOriginale: apiData.results[i].original_title,
              lingua: apiData.results[i].original_language,
              voto: apiData.results[i].vote_average,
            };

            var htmlRisultato = template(data);
            $('#lista_film').append(htmlRisultato);

          }
        },
        error: function (error) {
          console.log('Error retrieving data');
        },
      });
    }
  });

});

/**********************************/
/*************FUNZIONI*************/
/**********************************/
