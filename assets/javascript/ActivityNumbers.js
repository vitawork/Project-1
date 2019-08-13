var right = 0;
var wrong = 0;
var vguesremcounter = 6;

var NumbersActivity = {
  word: "",
  userkey: "",
  matchesnumber: 0,

  empty_word: function() {
    $("#word").text("");
    for (let i = 0; i < this.word.length; i++) {
      $("#word").text($("#word").text() + "_ ");
    }
  },
  small_reset: function() {
    $("#guesrem").text(6);
    $("#gueswords").text("");
    $("#word").text("");
    vguesremcounter = 6;
    this.userkey = "";
    this.matchesnumber = 0;
  },
  reset: function() {
    this, this.small_reset();
    right = 0;
    wrong = 0;
    tout = 0;
    actualqindex = -1;
    answerposition = -1;
    transanswer = "";
    Next_Numbers_Activity();
  },

  sust_letter: function(index) {
    var temp = $("#word").text();
    $("#word").text("");

    for (var j = 0; j < temp.length; j++) {
      if (j === index * 2) {
        $("#word").text($("#word").text() + this.userkey);
      } else {
        $("#word").text($("#word").text() + temp[j]);
      }
    }
  },

  validate: function(strValue) {
    var objRegExp = /^[a-z]+$/;
    return objRegExp.test(strValue);
  }
};

function show_question_answers_numbers(index) {
  var text = Game.themes.numbers[index];
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/language/translate/v2",
    data: {
      key: "AIzaSyAA-XZRJ85U6jZ6KPWn21pLiwaNRBFDTQo",
      source: "en",
      target: "es",
      q: text
    },
    dataType: "jsonp",
    success: function(data) {
      transanswer = First_to_UpperCase(
        data.data.translations[0].translatedText
      );
      NumbersActivity.word = transanswer;
      NumbersActivity.empty_word();
      $("#numberimg").text(index);

      $("#guesrem").html("<strong> 6</strong>");
      $("#gueswords").html("<strong> </strong>");
    },
    error: function(data) {
      alert("Translate API has failed");
    }
  });
}

function right_wrong_timeout_answer_numbers(rwt) {
  clearTimeout(question_timeout);
  clearInterval(intervalId);

  if (rwt === "Right Answer") {
    right++;
    Game.AddProgress("numbers", Game.themes.numbers[actualqindex]);
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

  $("#answer").text("Answer: ");
  $("#transanswer").text(transanswer);

  database.ref(Game.userKey + "/numbers").once("value", function(snapshot) {
    if (snapshot.numChildren() + tout + wrong === Game.themes.numbers.length) {
      $(".nextn").text("Finish");
    } else {
      $(".nextn").text("Next");
    }
  });

  next_timeout = setTimeout(function() {
    Next_Numbers_Activity();
  }, 6000);
}

function Next_Numbers_Activity() {
  if (actualqindex === Game.themes.numbers.length - 1) {
    database.ref(Game.userKey + "/numbers").once("value", function(snapshot) {
      if (snapshot.numChildren() === Game.themes.numbers.length) {
        $(".startn").html("Clean Progress");
      } else {
        $(".startn").html("Start Again");
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
    database.ref(Game.userKey + "/numbers").once("value", function(snapshot) {
      var data = snapshot.val();
      var found = false;

      actualqindex++;
      for (var key in data) {
        if (data[key] === Game.themes.numbers[actualqindex]) {
          found = true;
        }
      }

      if (found) {
        Next_Numbers_Activity();
      } else {
        $(".nextn").text("Next");

        timer = 60;
        NumbersActivity.small_reset();

        $("#divcentral3").css("display", "none");
        $("#divcentral2, #timerrow2").fadeOut(500, function() {
          $("#divcentral1, #timerrow1").fadeIn(500);

          $("#h3gueswords").hide();
          $("#h3guesrem")
            .hide()
            .show(300, function() {
              $("#h3gueswords").show(300);
            });
        });

        $("#timerrow1 h4, #timerrow2 h4").text("00:00");
        $("#winrow h4").text("  " + right);
        $("#looserow h4").text("  " + wrong);
        $("#timeoutrow h4").text("  " + tout);

        show_question_answers_numbers(actualqindex);
        intervalId = setInterval(count, 1000);

        question_timeout = setTimeout(function() {
          clearInterval(intervalId);
          audiofail.play();
          right_wrong_timeout_answer_numbers("Time Out");
        }, 1000 * timer);
      }
    });
  }
}

$(document).ready(function() {
  NumbersActivity.reset(); ///////////star the game///////////

  document.onkeyup = function(event) {
    if ($("#divcentral1").css("display") === "block" && vguesremcounter > 0) {
      NumbersActivity.userkey = event.key;

      if (
        NumbersActivity.validate(NumbersActivity.userkey) &&
        $("#gueswords")
          .text()
          .indexOf(NumbersActivity.userkey) === -1
      ) {
        for (var i = 0; i < NumbersActivity.word.length; i++) {
          if (
            NumbersActivity.word[i].toLowerCase() === NumbersActivity.userkey
          ) {
            NumbersActivity.sust_letter(i);
            NumbersActivity.matchesnumber++;
          }
        }
        if (NumbersActivity.matchesnumber === NumbersActivity.word.length) {
          audiocorrect.play();
          right_wrong_timeout_answer_numbers("Right Answer");
        }

        $("#gueswords").append(" " + NumbersActivity.userkey);

        if (NumbersActivity.word.indexOf(NumbersActivity.userkey) === -1) {
          vguesremcounter--;
          $("#guesrem").text(vguesremcounter);

          if (vguesremcounter === 0) {
            audiofail.play();

            right_wrong_timeout_answer_numbers("Wrong Answer");
          }
        }
      }
    }
  };

  // button next///////////
  $(".nextn").click(function() {
    Next_Numbers_Activity();
    clearTimeout(next_timeout);
  });

  $(".startn").click(function() {
    if ($(".startn").text() === "Clean Progress") {
      Game.DeleteProgress("numbers");
    }
    NumbersActivity.reset();
  });
});
