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
      //update games data everytime database is updated
      gamesRef.onSnapshot(querySnapshot => {
        const gameData = querySnapshot.docs.map(doc => {
          if (!this.games.some(game => game["id"] == doc.id)) {
            var temp = doc.data();
            temp['id'] = doc.id;
            this.games.push(temp);
            const marker = new google.maps.Marker({
              position: { lat: temp["lat"], lng: temp["lng"] },
              map: null,
              label: temp["label"],
            })
            locations[temp["sport"]].push({"lat": temp["lat"], "lng": temp["lng"], "mark": marker});
          }
        });
      });
      //update data fields
      this.sport = sport;
      diffID = event.currentTarget.id;
      if (diffID == "begin") this.difficulty = 1;
      if (diffID == "amateur") this.difficulty = 2;
      if (diffID == "pro") this.difficulty = 3;
    },
    //Show game information screen
    showGameInfo(game) {
      $('#difficulty_container').hide();
      $('#instruction').hide();
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
      hideAllButOneMarker(this.indGame.label);
    },
    //Handle Joining game and update in database
    //TODO: add something like sending a calendar invite
    joinFunc() {
      //error check to make sure game isnt full
      if (this.indGame.numPlayers >= this.indGame.totPlayers) {
        alert("Game is already full, please try another");
        return;
      }
      //update number of players
      var newnumPlayers = parseInt(this.indGame.numPlayers)+1;
      this.indGame.numPlayers += 1;
      db.collection("All_Games").doc(this.indGame.id).set({numPlayers: newnumPlayers}, {merge: true});
      //redisplay all games for selected sport and difficulty
      selectDifficulty(level);
      $('#ind_game_interface').hide();
      alert("Game Joined Successfully!");
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

  google.maps.event.addListener(map, 'click', function (event) {
    if (newGame && onlyOnce) {
      var label = sport.charAt(0) + String(level) + String(index);
      const marker = new google.maps.Marker({
          position: event.latLng,
          map: map,
          label: label,
      });
      locations[sport].push({"lat": event.latLng.lat(), "lng": event.latLng.lng(), "mark": marker});
      newGameLat = event.latLng.lat();
      newGameLng = event.latLng.lng();
      onlyOnce = false;
    }
  });
}

//Some Global Variables
var sport = 'N/A';
var level = 'N/A';
var id = 1;
var newGame = false;
var onlyOnce = true;
var index = 0;

const db = firebase.firestore();
const gamesList = $('.games_list');

let gamesRef;// this is the object that firebase give us
let games = [];// this is a list of the game OBJECTS
let locations = {
  basketball: [],
  soccer: [],
  football: [],
  golf: [],
}
let unsubscribe;
let newGameLat;
let newGameLng;


// Main JQuery Function
$(document).ready(function () {
  // display landing page, hide everything else
  gamesRef = db.collection('All_Games');
  deleteDocs();
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
})
// End Main Jquery

// Button functions
function selectDifficulty(difficulty) { // select difficulty
  $('#instruction').hide();
  $('#selected_sport').hide();
  $('#difficulty_container').hide();
  $('#map_container').show();
  $(".games_list").show();
  $('.create_game').show();
  level = difficulty;
  hideAllMarkers();
  setTimeout(showMarkers(), 2000);
}

function createGameFunc() { // used when the user wants to create their own game
  $('.games_list').hide();
  $('.create_game').hide();
  $('#new_game_interface').show();
  $('#loc_label').show();
  newGame = true;
}

function generateGameFunc() { // used to post the game to the list
  // calculate all values for new database entry
  var max = parseInt($("#t_players").val());
  var curr = parseInt($('#c_players').val());
  var date = $('#game_date').val();
  var time = $('#appt').val();
  var label = sport.charAt(0) + String(level) + String(index);
  index += 1;
  //error checking
  if (!$('#game_date').val() || !$('#appt').val() || !$('#c_players').val() || !$('#t_players').val() || onlyOnce){ //Every field is filled
    alert("Please fill out all required fields");
    return;
  } else if (curr > max) { //current players less than or equal to max players
    alert("Please ensure the number of players joining is less than the total number of players");
    return;
  }
  //push new item to database
  gamesRef.add({
    sport: sport,
    date: date,
    time: time,
    numPlayers: curr,
    totPlayers: max,
    level: level,
    lat: newGameLat,
    lng: newGameLng,
    label: label,
  });
  //redisplay map screen
  $('#map_container').show();
  $('.games_list').show();
  $('.create_game').show();
  $('#new_game_interface').hide();
  $('#back_to_select').hide();
  $('#loc_label').hide();
  newGame = false;
  onlyOnce = true;
}

function displayHome() { //display landing page
  $('#instruction').hide();
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
  $('#loc_label').hide();
  newGame = false;
  onlyOnce = true;
}

function selectSport(sport_choice) { //Handles changing the highlight of the selected sport
  $('#football_button').css('border-color', '#FFCB05');
  $('#basketball_button').css('border-color', '#FFCB05');
  $('#soccer_button').css('border-color', '#FFCB05');
  $('#golf_button').css('border-color', '#FFCB05');
  $('#'+sport_choice+'_button').css('border-color', '#00274C');
  sport = sport_choice;
}

function findGames() { //display select dificulty screen
  //error check - ensure a sport is selected
  if (sport == 'N/A') {
      alert("Please select a sport before trying to find a game");
      return;
  }
  $('#button_container').hide();
  $('.sport_options').hide();
  if (sport == "soccer" || sport == "golf") {
    $('#selected_sport').html("<img id=selected src=images/" + sport + ".png>");
  }
  else {
    $('#selected_sport').html("<img id=selected src=images/" + sport + ".jpg>");
  }
  $('#difficulty_container').show();
  $('#Home').show();
  $('#selected_sport').show();
  $('#difficulty_container').show();
  $('#ind_game_interface').hide();
  $('#back_to_select').hide();
  $('#instruction').show();
}

function goBackFunc() { //display previous page
  $('#ind_game_interface').hide();
  $('#back_to_select').hide();
  $(".games_list").show();
  $('.create_game').show();
  showMarkers();
  newGame = false;
}

function hideAllMarkers() {
  for (sport_op in locations) {
    locations[sport_op].forEach(function (latlng, i) {
      latlng["mark"].setMap(null);
    });
  }
}

function showMarkers() {
  locations[sport].forEach(function (latlng, i) {
    if (latlng["mark"]["label"].charAt(1) == level){
      latlng["mark"].setMap(map);
    }
  });
}

function hideAllButOneMarker(id) {
  for (sport_op in locations) {
    locations[sport_op].forEach(function (latlng, i) {
      if (latlng["mark"]["label"] != id){
        latlng["mark"].setMap(null);
      }
    });
  }
}

function deleteDocs() {
  let now = new Date();
  gamesRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      let docDate = new Date(doc.data()["date"]);
      if (docDate < now){
        doc.ref.delete();
      } 
  });
});
}
