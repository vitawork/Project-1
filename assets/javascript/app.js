// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyChhfkmuIxDTD5w2c-ZnzMrxdAEVSuJQqw",
  authDomain: "proyect-1-52d99.firebaseapp.com",
  databaseURL: "https://proyect-1-52d99.firebaseio.com",
  projectId: "proyect-1-52d99",
  storageBucket: "",
  messagingSenderId: "550696355872",
  appId: "1:550696355872:web:b5626b42359e8d42"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//Game object has all game vars and funtions
var Game = {
  userName: "",
  userKey: "",

  themes: {
    animals: ["Pig", "Dog", "Cat", "Lizard", "Butterfly", "Cow", "Horse"],
    colors: [
      "White",
      "Black",
      "Red",
      "Pink",
      "Purple",
      "Blue",
      "Green",
      "Yellow"
    ],
    numbers: [
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine"
    ]
  },

  AddUser(name) {
    database.ref().once("value", function(snapshot) {
      var found = false;
      var data = snapshot.val();
      for (var key in data) {
        var user = data[key];
        if (user.name === name) {
          found = true;
          break;
        }
      }
      if (!found) {
        Game.userName = name;
        Game.userKey = database.ref().push({ name: name }).key;
      }
    });
  },

  ////every time user win > send the learned think to the database
  AddProgress(where, value) {
    database.ref(this.userKey + "/" + where).once("value", function(snapshot) {
      var found = false;
      var data = snapshot.val();
      for (var key in data) {
        if (data[key] === value) {
          found = true;
          break;
        }
      }
      if (!found) {
        database.ref(Game.userKey + "/" + where).push(value);
      }
    });
  },

  ////filling progress.html
  FillingProgressTables(data, theme) {
    var table;
    if (theme === "animals") {
      table = $("#tbody1");
    } else {
      if (theme === "colors") {
        table = $("#tbody2");
      } else {
        table = $("#tbody3");
      }
    }

    table.empty();
    if (data === null) {
      var newRow = $("<tr>").append($("<td>").text("No Progress Yet"));
      table.append(newRow);
    } else {
      for (var key in data) {
        var newRow = $("<tr>").append($("<td>").text(data[key]));
        table.append(newRow);
      }
    }
  }
  ////////Here add game  funtions***************
};

$(document).ready(function() {
  Game.userKey = "-LlcLojSZqZc--9lQThG"; //////delete, only for test**********

  //////getting the animals progress
  database.ref(Game.userKey + "/animals").on("value", function(snapshot) {
    data = snapshot.val();
    Game.FillingProgressTables(data, "animals");
  });

  //////getting the colors progress
  database.ref(Game.userKey + "/colors").on("value", function(snapshot) {
    data = snapshot.val();
    Game.FillingProgressTables(data, "colors");
  });

  //////getting the numbers progress
  database.ref(Game.userKey + "/numbers").on("value", function(snapshot) {
    data = snapshot.val();
    Game.FillingProgressTables(data, "numbers");
  });







  // Game.AddUser("Gordon");////************

  $(".card-header").on("click", function() {
    //////delete, only for test******
    Game.AddProgress("numbers", "seven"); //////delete, only for test********
  }); //////delete, only for test*******
});
