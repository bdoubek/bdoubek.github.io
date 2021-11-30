var resultView = new Vue({
  el: '#app',
  data: {
    renderKey:0,
    games: [],// this is a list of OBJECTS. So game[0].date gives the date, for example.
    difficulty:0,
    sport:'',
    indGame: '',// used to store individual game
  },
  methods: {

    // initializes Vue variables based on the javascript variables below
    // can't initialize difficulty this way for some reason, so doing that manually
    updateGames() {
      this.renderKey++;
      
      // doing this as a quick fix to a bug where games were being duplicated
      gamesRef.onSnapshot(querySnapshot => {
      this.games = [];
      const gameData = querySnapshot.docs.map(doc => {
        if (!this.games.includes(doc.data())) {
          var temp = doc.data();
          temp['id'] = doc.id;
          this.games.push(temp);
        }
       });
      });

      console.log("HERE");
      this.sport = sport;
      diffID = event.currentTarget.id;

      if (diffID == "begin") this.difficulty = 1;
      if (diffID == "amateur") this.difficulty = 2;
      if (diffID == "pro") this.difficulty = 3;

      console.log(this.sport, this.difficulty);
      console.log(games)
    },
    showGameInfo(game) {
      $('#difficulty_container').hide();
      $('#map_container').hide();
      $('.games_list').hide();
      $('.create_game').hide();
      //TODO add back button add join game button add info
      $('#new_game_interface').hide();
      $('#selected_sport').hide();
      $('#button_container').hide();
      $('.sport_options').hide();
      this.indGame = game;
      this.gameDocId = game.id;
      $('#ind_game_interface').show();
      $('#back_to_select').show();
    },
    joinFunc() {
      if (this.indGame.numPlayers >= this.indGame.totPlayers) {
        alert("Game is already full, please try another");
        return;
      }
      var newnumPlayers = parseInt(this.indGame.numPlayers)+1;
      db.collection("All_Games").doc(this.indGame.id).set({numPlayers: newnumPlayers}, {merge: true});
      displayHome();
    },
  }
})

let map
// initializes the map (div with id="map") to be ann arbor centered at UMICH
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 42.277, lng: -83.739 },
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  // $('#map').show();
}

// Not sure if this applies to vue, so feel free to change all of this up
var sport = 'N/A';
var level = 'N/A';
var id = 1;

const db = firebase.firestore();

const gamesList = $('.games_list');

let gamesRef;// this is the object that firebase give us
let games = [];// this is a list of the game OBJECTS
let unsubscribe;

// Main JQuery Function
$(document).ready(function () {
  // display landing page, hide everything else
  gamesRef = db.collection('All_Games');
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

  $('#back_to_select').click(goBackFunc);

  /*gamesRef.onSnapshot(querySnapshot => {
    games = [];
    const gameData = querySnapshot.docs.map(doc => {
      if (!games.includes(doc.data())) {
        var temp = doc.data();
        temp['id'] = doc.id;
        games.push(temp);
      }
    });
    console.log(games);
  });
  console.log("asdklfjaskfdjs")
  console.log(games)*/
})
// End Main Jquery

// Button functions
function selectDifficulty(difficulty) { // select difficulty
  $('#selected_sport').hide();
  $('#difficulty_container').hide();
  $('#map_container').show();
  $(".games_list").show();
  $('.create_game').show();
  level = difficulty;
}

function createGameFunc() { // used when the user wants to create their own game
  $('#map_container').hide();
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
  var date = $('#game_date').val();
  var time = $('#appt').val();
  //TODO: ADD LOCATION ADD ID TAG
  gamesRef.add({
    sport: sport,
    date: date,
    time: time,
    numPlayers: curr,
    totPlayers: max,
    level: level
  });

  // var new_game_str = "<button class=\"game_button\" id=" + id + ">#" + id + ": " + curr + "/" + max + "</button>"
  // $('.games_list').append(new_game_str);
  // id++;
  $('#map_container').show();
  $('.games_list').show();
  $('.create_game').show();
  $('#new_game_interface').hide();
  $('#back_to_select').hide();
}

function displayHome() {
  $('#difficulty_container').hide();
  $('#map_container').hide();
  $('.games_list').hide();
  $('.create_game').hide();
  $('#new_game_interface').hide();
  $('#Home').hide();
  $('#selected_sport').hide();
  $('#button_container').show();
  $('.sport_options').show();
  $('#ind_game_interface').hide();
  $('#back_to_select').hide();
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
    $('#ind_game_interface').hide();
    $('#back_to_select').hide();
}

function goBackFunc() {
  $('#ind_game_interface').hide();
  $('#back_to_select').hide();
  $('#map_container').show();
  $(".games_list").show();
  $('.create_game').show();
}

