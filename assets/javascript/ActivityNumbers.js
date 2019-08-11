
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
    reset: function() {
      
      $("#guesrem").text(6);
      $("#gueswords").text("");
      $("#word").text("");
      vguesremcounter = 6;
      this.userkey = "";
      this.matchesnumber = 0;
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

  function Next_Numbers_Activity() {
    if (actualqindex === Game.themes.numbers.length - 1) {
      database.ref(Game.userKey + "/numbers").once("value", function(snapshot) {
        var data = snapshot.val();
        var totalitemsdb = 0;
  
        for (var key in data) {
          totalitemsdb++;
        }
  
        if (totalitemsdb === Game.themes.numbers.length) {
          $(".start").html("Clean Progress");
        } else {
          $(".start").html("Start Again");
        }
      });
      $("#divcentral1").css("display", "none");
      $("#divcentral2").fadeOut(500, function() {
        $("#divcentral3").fadeIn(500);
      });
      $("#winrow h1").text("Correct: " + right);
      $("#looserow h1").text("Wrong: " + wrong);
      $("#timeoutrow h1").text("Time Out: " + tout);
    } else {
      database.ref(Game.userKey + "/numbers").once("value", function(snapshot) {
        var data = snapshot.val();
        var found = false;
        var totalitemsdb = 0;
  
        actualqindex++;
        for (var key in data) {
          totalitemsdb++;
          if (data[key] === Game.themes.numbers[actualqindex]) {
            found = true;
          }
        }
  
        if (found) {
          Next_Numbers_Activity();
        } else {
          $(".next").text("Next");
  
          timer = 120;
  
          $("#divcentral3").css("display", "none");
          $("#divcentral2").fadeOut(500, function() {
            $("#divcentral1").fadeIn(500);
    
           
            $("#answer2").hide();
            $("#guesrem")
              .hide()
              .show(300, function() {
                $("#answer2").show(300);
              });
          });
  
          $("#timerrow h4").text("00:00");
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
  

  //////////
NumbersActivity.reset();//////////////////////*************

$(document).ready(function() {
  document.onkeyup = function(event) {
    NumbersActivity.userkey = event.key;
    
      if (NumbersActivity.validate(NumbersActivity.userkey)) {
        if (
          $("#gueswords")
            .text()
            .indexOf(NumbersActivity.userkey) === -1
        ) {
          $("#gueswords").text(
            $("#gueswords").text() + " " + NumbersActivity.userkey
          );
          for (var i = 0; i < NumbersActivity.word.length; i++) {
            if (
              NumbersActivity.word[i].toLowerCase() === NumbersActivity.userkey
            ) {
              NumbersActivity.sust_letter(i);
              NumbersActivity.matchesnumber++;
              if (
                NumbersActivity.matchesnumber === NumbersActivity.word.length
              ) {///////////////
               right_wrong_timeout_answer("Right Answer");
              }
            }
          }
          if (NumbersActivity.word.indexOf(NumbersActivity.userkey) === -1) {
            vguesremcounter--;
            $("#guesrem").text(vguesremcounter);

            if (vguesremcounter === 0) {
              wrong++;
              $("#looserow").text(wrong);
              right_wrong_timeout_answer("Wrong Answer");
            }
          }
        }
      }
   
  };
});
