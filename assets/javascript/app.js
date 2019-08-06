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
  }
  ////////Here add game  funtions***************
};

//User object has all user funtions
var User = {
  name: "",
  AddUser(name) {
    /////implent it *************
  },
  SelectUser(name) {
    /////implent it *************
  }
};

$(document).ready(function() {


    
});
