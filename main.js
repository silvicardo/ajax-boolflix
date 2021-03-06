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

var paesiSupportati = ['it', 'en'];

$(document).ready(function () {
  console.log('welcome to ajax-BoolFlix');



  var apiParameters = {
    urlBase: 'https://api.themoviedb.org/3/search/multi',
    data: {
      api_key: 'e84c7d2ede59ead3397581c0ad7d4dec',
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

          $('.contenuti .card_contenuto').remove();

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

  function hasCover(content) {
    return (content.backdrop_path != null || content.poster_path != null );
  }

  for (var i = 0; i < apiData.results.length; i++) {

    var tipoContenuto = apiData.results[i].media_type;

    if (tipoContenuto == 'movie' || tipoContenuto == 'tv') {

      var contenuto = apiData.results[i];

      var voto = convertiInScalaDa1a5(contenuto.vote_average);
      console.log(voto);

      var htmlTemplateContenuto = $('#contenutoScript').html();
      var template = Handlebars.compile(htmlTemplateContenuto);

      var data = {
        titolo: (isMovie(tipoContenuto)) ? contenuto.title : contenuto.name,
        titoloOriginale: (isMovie(tipoContenuto)) ? contenuto.original_title : contenuto.original_name,
        lingua: gestisciLingua(contenuto.original_language),
        votazione: (voto != 'nd') ? gestisci(voto, contenuto) : 'nd',
        tipologiaContenuto: tipoContenuto,
        copertina : (hasCover(contenuto)) ? gestisciCopertinaPer(contenuto) : "<img class='copertina overlay' src='image-not-found.png' />'",
        trama: contenuto.overview,
      };

      var htmlRisultato = template(data);

      $('.contenuti').append(htmlRisultato);
    }

  }
}

function gestisciLingua(lingua) {
    var htmlOutput = '';

    if (paesiSupportati.includes(lingua)) {
      console.log(lingua + ' lingua supportata');
      htmlOutput = "<img class='bandiera' src='" + lingua + ".png' />";
    } else {
      htmlOutput = lingua + ' non supportata';
    }

    return htmlOutput;

}

function gestisci(voto, contenuto) {

  var tagVoto = '';

  for (var i = 1; i <= 5; i++) {
    tagVoto += (i <= voto) ? "<i class='fas fa-star'></i>" : "<i class='far fa-star'></i>";
  }

  return tagVoto;
}

function gestisciCopertinaPer(contenuto) {

  var path = (contenuto.backdrop_path != null) ? contenuto.backdrop_path : contenuto.poster_path;
  var dimensione = (contenuto.backdrop_path != null) ? 'w300' : 'w342';
  var urlCopertina = 'https://image.tmdb.org/t/p/' + dimensione + path;

  return "<img class='copertina overlay' src='" + urlCopertina + "' />'";
}

function convertiInScalaDa1a5(voto) {
  return (voto != 0) ? Math.ceil(voto / 2) : 'nd';
}
