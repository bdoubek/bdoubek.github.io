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

// Main JQuery Function
$(document).ready(function () {
  // display landing page, hide everything else
  displayHome();

  // Home button
  $('#Home').click(displayHome);

  // Sports selection buttons
  $('#football_button').click(function () {selectSport("football");})
  $('#basketball_button').click(function () {selectSport("basketball");})
  $('#soccer_button').click(function () {selectSport("soccer");})
  $('#golf_button').click(function () {selectSport("golf");})

  // Difficulty buttons
  $('#begin').click(function () {selectDifficulty(1);})
  $('#amateur').click(function () {selectDifficulty(2);})
  $('#pro').click(function () {selectDifficulty(3);})

  // Find games button
  $('#submit').click(findGames);

  // Create game button
  $('.create_game').click(createGameFunc);

  // Generate game button
  $('#generate_game').click(generateGameFunc);
})
// End Main Jquery

// Button functions
function selectDifficulty(difficulty) { // select difficulty
  $('#selected_sport').hide();
  $('#difficulty_container').hide();
  $('#map').show();
  $(".games_list").show();
  $('.create_game').show();
  level = difficulty;
}

function createGameFunc() { // used when the user wants to create their own game
  $('#map').hide();
  $('.games_list').hide();
  $('.create_game').hide();
  $('#new_game_interface').show();
}

function generateGameFunc() { // used to post the game to the list
  if (!$('#game_date').val() || !$('#appt').val() || !$('#c_players').val() || !$('#t_players').val()){
    alert("Please fill out all required fields");
    return;
  } else if ($('#c_players').val() > $('#t_players').val()) {
    alert("Please ensure the number of players joining is less than the total number of players");
    return;
  }
  var max = $("#t_players").val();
  var curr = $('#c_players').val();
  var new_game_str = "<button class=\"game_button\" id=" + id + ">#" + id + ": " + curr + "/" + max + "</button>"
  $('.games_list').append(new_game_str);
  id++;
  $('#map').show();
  $('.games_list').show();
  $('.create_game').show();
  $('#new_game_interface').hide();
}

function displayHome() {
  $('#difficulty_container').hide();
  $('#map').hide();
  $('.games_list').hide();
  $('.create_game').hide();
  $('#new_game_interface').hide();
  $('#Home').hide();
  $('#selected_sport').hide();
  $('#button_container').show();
  $('.sport_options').show();
}

function selectSport(sport_choice) {
  $('#football_button').css('border-color', '#FFCB05');
  $('#basketball_button').css('border-color', '#FFCB05');
  $('#soccer_button').css('border-color', '#FFCB05');
  $('#golf_button').css('border-color', '#FFCB05');
  $('#'+sport_choice+'_button').css('border-color', 'blue');
  sport = sport_choice;
}

function findGames() {
  if (sport == 'N/A') {
      alert("Please select a sport before trying to find a game");
      return;
    }
    $('#button_container').hide();
    $('.sport_options').hide();
    $('#selected_sport').html("<img id=selected src=images/" + sport + ".jpg>");
    $('#difficulty_container').show();
    $('#Home').show();
    $('#selected_sport').show();
    $('#difficulty_container').show();
}