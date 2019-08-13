var audiofail = new Audio("assets/sounds/fail.mp3");
var audiocorrect = new Audio("assets/sounds/correct.wav");

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
  lang: "",
  langs: [
    ["Spanish", "es"],
    ["French", "fr"],
    ["Arabic", "ar"],
    ["Dutch", "nl"],
    ["Japanese", "ja"],
    ["Russian", "ru"],
    ["Italian", "it"],
    ["Hindi", "hi"]
  ],

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
      "Zero",
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

  AddUser(name, l) {
    database.ref().once("value", function(snapshot) {
      var found = false;
      var data = snapshot.val();
      var userkey;
      for (var key in data) {
        var user = data[key];
        if (user.name === name) {
          found = true;
          userkey = key;
          break;
        }
      }
      if (!found) {
        userkey = database.ref().push({ name: name }).key;
      }

      var userlang = "es";

      for (let i = 0; i < Game.langs.length; i++) {
        if (Game.langs[i][0] === l) {
          userlang = Game.langs[i][1];
        }
      }

      localStorage.clear();

      localStorage.setItem("name-user", name);
      localStorage.setItem("key-user", userkey);
      localStorage.setItem("lang-user", userlang);

      Game.userName = localStorage.getItem("name-user");
      Game.userKey = localStorage.getItem("key-user");
      Game.lang = localStorage.getItem("lang-user");

      window.location.href = "./Home.html";
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
  DeleteProgress(where) {
    database.ref(this.userKey + "/" + where).once("value", function(snapshot) {
      var data = snapshot.val();
      for (var key in data) {
        database.ref(Game.userKey + "/" + where + "/" + key).remove();
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

Game.userName = localStorage.getItem("name-user");
Game.userKey = localStorage.getItem("key-user");
Game.lang = localStorage.getItem("lang-user");

////////////Colors Activities Begin//////////////////////////////////////////////////////////////////////////////////////////

var timer = 60;
var right = 0;
var wrong = 0;
var tout = 0;
var actualqindex = -1;
var answerposition = -1;
var transanswer = "";

var next_timeout;
var question_timeout;
var intervalId;

function First_to_UpperCase(word) {
  var w = "";

  w = w + word[0].toUpperCase();
  for (let i = 1; i < word.length; i++) {
    w = w + word[i];
  }
  return w;
}

function Reset_Colors_Activity() {
  right = 0;
  wrong = 0;
  tout = 0;
  actualqindex = -1;
  answerposition = -1;
  transanswer = "";
  next();
}

function show_question_answers(index) {
  var text = Game.themes.colors[index];
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/language/translate/v2",
    data: {
      key: "AIzaSyAA-XZRJ85U6jZ6KPWn21pLiwaNRBFDTQo",
      source: "en",
      target: Game.lang,
      q: text
    },
    dataType: "jsonp",
    success: function(data) {
      transanswer = First_to_UpperCase(
        data.data.translations[0].translatedText
      );

      $("#question").html(
        transanswer +
          " <img alt='icon' id='iconsc1' class='iconsound' src='assets/images/Sound-On2.png'>"
      );

      answerposition = Math.floor(Math.random() * 4 + 1);
      for (let i = 1; i < 5; i++) {
        $("#answer" + i).html("");
      }

      for (let i = 1; i < 5; i++) {
        $("#answer" + i).css("display", "block");
        if (i === answerposition) {
          $("#answer" + i)
            .html(Game.themes.colors[index])
            .css({
              "background-color": Game.themes.colors[index],
              opacity: "0.85"
            });
        } else {
          var j = Math.floor(Math.random() * Game.themes.colors.length);
          while (
            $("#answer1").html() === Game.themes.colors[j] ||
            $("#answer2").html() === Game.themes.colors[j] ||
            $("#answer3").html() === Game.themes.colors[j] ||
            $("#answer4").html() === Game.themes.colors[j] ||
            index === j
          ) {
            j = Math.floor(Math.random() * Game.themes.colors.length);
          }
          $("#answer" + i)
            .html(Game.themes.colors[j])
            .css({
              "background-color": Game.themes.colors[j],
              opacity: "0.85"
            });
        }
      }
    },
    error: function(data) {
      alert("Translate API has failed");
    }
  });
}

function right_wrong_timeout_answer(rwt) {
  clearTimeout(question_timeout);
  clearInterval(intervalId);

  if (rwt === "Right Answer") {
    right++;
    Game.AddProgress("colors", Game.themes.colors[actualqindex]);
    $("#winrow h4").text("  " + right);
  } else {
    if (rwt === "Wrong Answer") {
      wrong++;
      $("#looserow h4").text("  " + wrong);
    } else {
      tout++;
      $("#timeoutrow h4").text("  " + tout);
    }
  }

  $("#divcentral3").css("display", "none");
  $("#divcentral1, #timerrow1").fadeOut(500, function() {
    $("#divcentral2, #timerrow2").fadeIn(500, function() {
      $("#rwt")
        .fadeOut()
        .fadeIn()
        .fadeOut()
        .fadeIn();
    });
  });
  $("#rwt").text(rwt);

  $("#answer")
    .text("Answer: ")
    .css({
      "background-color": Game.themes.colors[actualqindex],
      opacity: "0.85"
    });
  $("#transanswer")
    .text(transanswer)
    .css({
      "background-color": Game.themes.colors[actualqindex],
      opacity: "0.85"
    });

  database.ref(Game.userKey + "/colors").once("value", function(snapshot) {
    if (snapshot.numChildren() + tout + wrong === Game.themes.colors.length) {
      $(".next").text("Finish");
    } else {
      $(".next").text("Next");
    }
  });

  next_timeout = setTimeout(function() {
    next();
  }, 6000);
}

function next() {
  if (actualqindex === Game.themes.colors.length - 1) {
    database.ref(Game.userKey + "/colors").once("value", function(snapshot) {
      if (snapshot.numChildren() === Game.themes.colors.length) {
        $(".start").html("Clean Progress");
      } else {
        $(".start").html("Start Again");
      }
    });
    $("#divcentral1, #timerrow1").css("display", "none");
    $("#divcentral2, #timerrow2").fadeOut(500, function() {
      $("#divcentral3").fadeIn(500);
    });
    $("#winrow h1").text("Correct: " + right);
    $("#looserow h1").text("Wrong: " + wrong);
    $("#timeoutrow h1").text("Time Out: " + tout);
  } else {
    database.ref(Game.userKey + "/colors").once("value", function(snapshot) {
      var data = snapshot.val();
      var found = false;

      actualqindex++;
      for (var key in data) {
        if (data[key] === Game.themes.colors[actualqindex]) {
          found = true;
        }
      }

      if (found) {
        next();
      } else {
        $(".next").text("Next");

        timer = 60;

        $("#divcentral3").css("display", "none");
        $("#divcentral2, #timerrow2").fadeOut(500, function() {
          $("#divcentral1, #timerrow1").fadeIn(500);

          $("#answer4").hide();
          $("#answer3").hide();
          $("#answer2").hide();
          $("#answer1")
            .hide()
            .show(300, function() {
              $("#answer2").show(300, function() {
                $("#answer3").show(300, function() {
                  $("#answer4").show(300, function() {
                    StopQClick = false;
                  });
                });
              });
            });
        });

        $("#timerrow1 h4, #timerrow2 h4").text("00:00");
        $("#winrow h4").text("  " + right);
        $("#looserow h4").text("  " + wrong);
        $("#timeoutrow h4").text("  " + tout);

        show_question_answers(actualqindex);
        intervalId = setInterval(count, 1000);

        question_timeout = setTimeout(function() {
          clearInterval(intervalId);
          audiofail.play();
          right_wrong_timeout_answer("Time Out");
        }, 1000 * timer);
      }
    });
  }
}

function count() {
  timer--;
  var converted = timeConverter(timer);
  $("#timerrow1 h4, #timerrow2 h4").text(converted);
}

function timeConverter(t) {
  var minutes = Math.floor(t / 60);
  var seconds = t - minutes * 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (minutes === 0) {
    minutes = "00";
  } else if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return minutes + ":" + seconds;
}

function FillingIndexSelect() {
  for (let i = 0; i < Game.langs.length; i++) {
    $("#lenguages").append("<option>" + Game.langs[i][0] + "</option>");
  }
}

//////////////////////////////////////////fix/////////************** */
// function reader() {
//   var text = encodeURIComponent(Game.transanswer);
//   var url = `https://translate.google.com/translate_tts?ie=UTF-8&q="${encodeURIComponent(text)}&tl=es&client=tw-ob`;
//   $("audio")
//     .attr("src", url)
//     .get(0)
//     .play();
// }

var StopQClick;

$(document).ready(function() {
  // $("#question").on("click", function(e) {
  //   e.preventDefault();
  //   console.log("pppppp");
  //   var text = "hola";
  //   text= encodeURIComponent(text);
  //   var url=`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=es&client=tw-ob`;
  //   $('audio').attr('src',url).get(0).play();

  // });

  // answers buttons////////////
  $(".q").on("click", function(event) {
    event.preventDefault();

    if (!StopQClick) {
      StopQClick = true;
      var correctans = "answer" + answerposition;
      if ($(this).attr("id") === correctans) {
        right_wrong_timeout_answer("Right Answer");
        audiocorrect.play();
      } else {
        right_wrong_timeout_answer("Wrong Answer");
        audiofail.play();
      }
    }
  });

  // button next///////////
  $(".next").click(function() {
    next();
    clearTimeout(next_timeout);
  });

  $(".start").click(function() {
    if ($(".start").text() === "Clean Progress") {
      Game.DeleteProgress("colors");
    }
    Reset_Colors_Activity();
  });

  ////////////Colors Activities End//////////////////////////////////////////////////////////////////////////////////////////
  ////////////Home Page Begin//////////////////////////////////////////////////////////////////////////////////////////
  var LearnOrPlay;
  $(".LearnPlay").on("click", function(even) {
    event.preventDefault();

    if ($(this).attr("id") === "progress") {
      window.location.href = "./Progress.html";
    } else {
      LearnOrPlay = $(this).attr("id");
      $("#rownum1").css("display", "none");
      $("#rownum2").css("display", "block");
    }
  });

  $(".CNA").on("click", function(event) {
    event.preventDefault();
    var CNA = $(this).attr("id");
    if (LearnOrPlay === "play") {
      if (CNA === "colors") {
        window.location.href = "./ActivityColors.html";
      }
      if (CNA === "numbers") {
        window.location.href = "./ActivityNumbers.html";
      }
      if (CNA === "animals") {
        window.location.href = "./ActivityAnimals.html";
      }
    } else {
      window.location.href = "./Learning.html";
    }
    $("#rownum2").css("display", "none");
    $("#rownum1").css("display", "block");
  });
  ////////////Home Page End//////////////////////////////////////////////////////////////////////////////////////////
  ////////////Index Begin//////////////////////////////////////////////////////////////////////////////////////////

  $("#login").on("click", function() {
    if (
      $("#username")
        .val()
        .trim() !== "" &&
      $("#lenguages")
        .val()
        .trim() !== "Languages"
    ) {
      Game.AddUser(
        $("#username")
          .val()
          .trim(),
        $("#lenguages")
          .val()
          .trim()
      );

      $("#username").val("");
      $("#lenguages").val("Languages");
    }
  });
  ////////////Index End//////////////////////////////////////////////////////////////////////////////////////////

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
});
