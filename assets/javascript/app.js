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
    database.ref(this.userName + "/" + where).once("value", function(snapshot) {
      var data = snapshot.val();
      if (snapshot.val() !== null) {
        console.log("no es null");
      }
      console.log(data);
    });
  }
  ////////Here add game  funtions***************
};

$(document).ready(function() {
  //   Game.userName="vita";

  //   database.ref("vita").collection("colors");

  //   Game.AddProgress("colors","red");
  // database.ref('vita/hgvghv').push("ppppppp");
  var a = Game.AddUser("Gordon");
  //   console.log(a);
});
