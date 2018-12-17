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
          console.log(apiData.results);

          $('#lista_film .film').remove();

          mostraListaFilmDa(apiData);

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

function mostraListaFilmDa(apiData) {

  for (var i = 0; i < apiData.results.length; i++) {
    var voto = convertiInScalaDa1a5(apiData.results[i].vote_average);

    var htmlTemplateFilm = $('#filmScript').html();
    var template = Handlebars.compile(htmlTemplateFilm);

    var data = {
      titolo: apiData.results[i].title,
      titoloOriginale: apiData.results[i].original_title,
      lingua: apiData.results[i].original_language,
      voto: (voto != 'nd') ? '' : 'nd',
    };
    var htmlRisultato = template(data);

    $('#lista_film').append(htmlRisultato);

    //gestisco stelle se voto non è nd
    gestisciStellePerFilmA(i, voto)

  }
}

function gestisciStellePerFilmA(indice, voto) {
  var indiceFilm = indice + 1;
  var stelle = $('#lista_film').children().eq(indiceFilm).find('.score').children('i.fa-star');

  if (voto != 'nd') {
    for (var starIndex = 0; starIndex < 5; starIndex++) {
      if (starIndex < voto) {
        var stella = stelle.eq(starIndex);
        stella.addClass('fas').removeClass('far');
      }
    }
  } else {
    stelle.addClass('hidden');
  }
}

function convertiInScalaDa1a5(voto) {
  return (voto != 0) ? Math.ceil(voto / 2) : 'nd';
}
