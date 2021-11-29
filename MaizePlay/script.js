// var resultView = new Vue({
//   el: '#app',
//   data: {
//     artist1: './img/1.jpg',
//     artist2: './img/2.jpg',
//   },
//   methods: {

//   }
// })

// Not sure if this applies to vue, so feel free to change all of this up
var sport = 'N/A';
var level = 'N/A';
var id = 1;

$(document).ready(function () {
  // Hide everything that's not in the landing page
  $('#difficulty_container').hide();
  $('#map').hide();
  $('.games_list').hide();
  $('.create_game').hide();
  $('#new_game_interface').hide();

  // Football button click
  $('#fball_button').click(function () {
    $('#fball_button').css('border', 'solid');
    $('#fball_button').css('border-width', '10px');
    $('#bball_button').css('border', 'none');
    $('#sccer_button').css('border', 'none');
    $('#golf_button').css('border', 'none');
    sport = "football";
  })

  // Basketball button click
  $('#bball_button').click(function () {
    $('#bball_button').css('border', 'solid');
    $('#bball_button').css('border-width', '10px');
    $('#fball_button').css('border', 'none');
    $('#sccer_button').css('border', 'none');
    $('#golf_button').css('border', 'none');
    sport = "basketball";
  })

  // Soccer button click
  $('#sccer_button').click(function () {
    $('#sccer_button').css('border', 'solid');
    $('#sccer_button').css('border-width', '10px');
    $('#fball_button').css('border', 'none');
    $('#bball_button').css('border', 'none');
    $('#golf_button').css('border', 'none');
    sport = "soccer";
  })

  // Golf button click
  $('#golf_button').click(function () {
    $('#golf_button').css('border', 'solid');
    $('#golf_button').css('border-width', '10px');
    $('#fball_button').css('border', 'none');
    $('#bball_button').css('border', 'none');
    $('#sccer_button').css('border', 'none');
    sport = "golf";
  })

  // Beginner button click
  $('#begin').click(function () {
    level = 1;
    selectDifficulty();
  })

  // Amateur button click
  $('#amateur').click(function () {
    level = 2;
    selectDifficulty();
  })

  // Pro button click
  $('#pro').click(function () {
    level = 3;
    selectDifficulty();
  })

  // Find games click
  $('#submit').click(function () {
    if (sport == 'N/A') {
      return;
    }
    $('#button_container').hide();
    $('.sport_options').hide();
    if (sport == 'basketball') {
      $('#selected_sport').html("<img id=selected src=images/basketball.jpg>");
    }
    else if (sport == 'football') {
      $('#selected_sport').html("<img id=selected src=images/football.jpg>");
    }
    else if (sport == 'soccer') {
      $('#selected_sport').html("<img id=selected src=images/soccer.jpg>");
    }
    else {
      $('#selected_sport').html("<img id=selected src=images/golf.jpg>");
    }
    $('#difficulty_container').show();
  })

  $('.create_game').click(createGameFunc);

  $('#generate_game').click(generateGameFunc);
})

// Button functions
function selectDifficulty() { // select difficulty
  $('#selected_sport').hide();
  $('#begin').hide();
  $('#amateur').hide();
  $('#pro').hide();
  $('#map').show();
  $(".games_list").show();
  $('.create_game').show();
}

function createGameFunc() { // used when the user wants to create their own game
  $('#map').hide();
  $('.games_list').hide();
  $('.create_game').hide();
  $('#new_game_interface').show();
}

function generateGameFunc() { // used to post the game to the list
  $('#map').show();
  $('.games_list').show();
  $('.create_game').show();
  $('#new_game_interface').hide();
  // having troule with this part, for some reason it's not getting the values
  var max = $("#t_players").value;
  var curr = $('#c_players').value;
  var new_game_str = "<button class=\"game_button\" id=" + id + ">#" + id + ": " + curr + "/" + max + "</button>"
  $('.games_list').append(new_game_str);
  id++;
}