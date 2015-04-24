(function( $ ){

  var lines = 10;
  var characters = 24;
  var dataURL = "předloha.čti";
  var refreshInterval = 10 * 1000
  var letters = "1234567890 QWERTYUIOPASDFGHJKLZXCVBNM_*+,./;'[]-=(){}\\\""; //missing letters will be added JIT
  var renderDelay = 100

  /*
  / Render the main page structure
  */
  var prepareUI = function() {

    var $body = $( document.body );

    for (var i = 0; i < lines; i++) {
      var $line = $("<div>").addClass("line line" + i);
      $body.append($line);
      for (var j = 0; j < characters; j++) {
        var $letter = $("<div>").addClass("letter letter" + j);
        $letter.append($("<div>").addClass("wrapper"));
        $line.append($letter);
      }
    }
  }

  /*
  / Set particular letter
  */
  var setLetter = function($node, letter) {
    var currentLetter = $node.html();

    //letter
    if (typeof letter === 'undefined' || letter.length < 1 || letter == '') {
      letter = " ";
    }

    letter = letter[0].toUpperCase();

    var positionOfTheLetter = letters.indexOf(letter);
    if (positionOfTheLetter < 0) {
      positionOfTheLetter = letters.length;
      letters = letters + letter;
    //  console.log(letters);
    }

    var rotate = function ($node, letters, index, end) {
      $node.text(letters[index]);
      if (index < end) {
          setTimeout(function() {
            rotate($node, letters, ++index, end);
          }, renderDelay);
      }
    }
    if (letter != $node.text()) {
      rotate($node, letters, 0, positionOfTheLetter);
    } else {
    //  console.log(typeof letter, "'" + letter + "'", typeof $node.text(), "'" + $node.text() + "'");
    }
  }


  /*
  / Set letters size
  */
  var fixLetterSizes = function(data) {
    //lines, letters
    var $window = $( window );
    var screenWidth = $window.width();
    var screenHeight = $window.height();

    var letterWidth = screenWidth / characters;
    var letterHeight = screenHeight / characters;

    $(".line").css("height", (100 / lines) + "%");
    $(".letter").css("width", (100 / characters) + "%");


    //letter
    var $wrappers = $(".wrapper");
    var height = $wrappers.first().innerHeight();
    $wrappers.css("line-height", height + "px");
    $wrappers.css("font-size", (height - (height * .3)) + "px");
  }

  /*
  / Render the data on the UI
  */
  var render = function(data) {
    var parsed = data.split("\n")

    //add full count of lines
    for (var i = 0; i < lines; i++) {
  //    console.log(parsed[i]);
      if (!parsed[i]) {
        parsed[i] = "";
      }
    }

    var min = ""+new Date().getMinutes();
    var hrs = ""+new Date().getHours();

    var time = " " + (hrs.length == 1?"0" + hrs: hrs) + ":" + (min.length == 1?"0" + min: min);
    parsed[lines - 1] = "                            ".substr(0, characters - parsed[lines - 1].length - time.length) + time

    for (var i = 0; i < lines; i++) {
      for (var j = 0; j < characters; j++) {
        if (parsed.length > i && parsed[i].length > j) {
          setLetter($(".line" + i + " .letter" + j).find(".wrapper"), parsed[i][j]);
        } else {
          setLetter($(".line" + i + " .letter" + j).find(".wrapper"), " ");
        }
      }
    }
  }

  /*
  / Load data from the text file
  */
  var load = function() {
    $.ajax({
      type : "GET",
      url : dataURL,
      data : "",
      dataType : 'text',
      success : function( data ) {
        render(data);

        //write time
        var hrs = "" + new Date().getHours();
        var mins = " " + new Date().getMinutes();

//        console.log(typeof hrs, hrs[0], mins);


//        parsed[lines.length - 1] = new Date().getHours() + ":" + new Date().getMinutes(); //TEST LINE
      }
    });
  };

  prepareUI();
  load();
  setInterval(load, refreshInterval);

  fixLetterSizes();

  $( window ).resize(function() {
    fixLetterSizes();
  });

})( jQuery );
