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
"backdrop_sizes": [
  "w300",
  "w780",
  "w1280",
  "original"
],
"logo_sizes": [
  "w45",
  "w92",
  "w154",
  "w185",
  "w300",
  "w500",
  "original"
],
"poster_sizes": [
  "w92",
  "w154",
  "w185",
  "w342",
  "w500",
  "w780",
  "original"
],
"profile_sizes": [
  "w45",
  "w185",
  "h632",
  "original"
],
"still_sizes": [
  "w92",
  "w185",
  "w300",
  "original"
]
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
    urlBase: 'https://api.themoviedb.org/3/search/multi',
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

          $('#lista_contenuti .contenuto').remove();

          mostraFilmESerieTVda(apiData);

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

function mostraFilmESerieTVda(apiData){

  function isMovie(mediaType) {
    return mediaType == 'movie';
  }

  for (var i = 0; i < apiData.results.length; i++) {

    var tipoContenuto = apiData.results[i].media_type;

    if (tipoContenuto == 'movie' || tipoContenuto == 'tv') {
      var voto = convertiInScalaDa1a5(apiData.results[i].vote_average);
      console.log(isMovie(tipoContenuto));

      var htmlTemplateContenuto = $('#contenutoScript').html();
      var template = Handlebars.compile(htmlTemplateContenuto);

      var data = {
        titolo:(isMovie(tipoContenuto)) ? apiData.results[i].title : apiData.results[i].name,
        titoloOriginale: (isMovie(tipoContenuto)) ? apiData.results[i].original_title : apiData.results[i].original_name,
        lingua: apiData.results[i].original_language,
        voto: (voto != 'nd') ? '' : 'nd',
        tipologiaContenuto: tipoContenuto,
      };
      var htmlRisultato = template(data);

      $('#lista_contenuti').append(htmlRisultato);

      gestisciCopertinaPerContenutoAd(i, apiData.results[i].backdrop_path);

      //gestisco stelle se voto non è nd
      gestisciStellePerContenutoA(i, voto);
    }

  }
}

function gestisciCopertinaPerContenutoAd(indice, backdropPath) {
  var indiceFilm = indice + 1;
  var copertina = $('#lista_contenuti').children().eq(indiceFilm).find('.copertina_contenuto').children('img');

  if (backdropPath != null) {
    urlCopertina = 'https://image.tmdb.org/t/p/w300' + backdropPath;

    copertina.attr('src', urlCopertina);
  } else {
    $('#lista_contenuti').children().eq(indiceFilm).find('.copertina_contenuto').text('Copertina non disponibile');
  }

}

function gestisciStellePerContenutoA(indice, voto) {
  var indiceFilm = indice + 1;
  var stelle = $('#lista_contenuti').children().eq(indiceFilm).find('.punteggio').children('i.fa-star');

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
