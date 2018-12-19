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

function mostraFilmESerieTVda(apiData) {

  function isMovie(mediaType) {
    return mediaType == 'movie';
  }

  for (var i = 0; i < apiData.results.length; i++) {

    var tipoContenuto = apiData.results[i].media_type;

    if (tipoContenuto == 'movie' || tipoContenuto == 'tv') {
      var voto = convertiInScalaDa1a5(apiData.results[i].vote_average);
      console.log(voto);

      var htmlTemplateContenuto = $('#contenutoScript').html();
      var template = Handlebars.compile(htmlTemplateContenuto);

      var data = {
        titolo: (isMovie(tipoContenuto)) ? apiData.results[i].title : apiData.results[i].name,
        titoloOriginale: (isMovie(tipoContenuto)) ? apiData.results[i].original_title : apiData.results[i].original_name,
        lingua: apiData.results[i].original_language,
        votazione: (voto != 'nd') ? gestisci(voto, apiData.results[i]) : 'nd',
        tipologiaContenuto: tipoContenuto,
      };

      if (apiData.results[i].backdrop_path != null || apiData.results[i].poster_path != null ) {
        data.copertina = gestisciCopertinaPerContenutoAd(apiData.results[i]);
      } else {
        data.copertina = 'Nessuna copertina disponibile';
      }

      var htmlRisultato = template(data);

      $('#lista_contenuti').append(htmlRisultato);
    }

  }
}

function gestisci(voto, contenuto) {

  var tagVoto = '';

  for (var i = 1; i <= 5; i++) {
    tagVoto += (i <= voto) ? "<i class='fas fa-star'></i>" : "<i class='far fa-star'></i>";
  }

  return tagVoto;
}

function gestisciCopertinaPerContenutoAd(contenuto) {

  var path = (contenuto.backdrop_path != null) ? contenuto.backdrop_path : contenuto.poster_path;
  var dimensione = (contenuto.backdrop_path != null) ? 'w300' : 'w342';
  var urlCopertina = 'https://image.tmdb.org/t/p/' + dimensione + pathCopertina;

  return "<img src='" + urlCopertina + "' />'";
}

function convertiInScalaDa1a5(voto) {
  return (voto != 0) ? Math.ceil(voto / 2) : 'nd';
}
