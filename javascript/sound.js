// immediate function
document.sound = (function () {

  // module object; add all methods and properties, that should be visible globally
  var module = {};

    var newSound = new buzz.sound("audio-samples/CP.mp3", {
        preload: true,
        autoplay: false,
    });

    var myGroup = new buzz.group([ 
        new buzz.sound("audio-samples/CP.mp3"),
        new buzz.sound("audio-samples/BD0000.mp3"),
        new buzz.sound("audio-samples/BD0010.mp3"),
        new buzz.sound("audio-samples/Adb_Clp.wav")
    ]);

    //myGroup.loop().play().fadeIn();

    /*
    myGroup.bind( "canplay", function () {
    	myGroup.play();
    } );

    /*
    var myGroup = new buzz.group([ 
        new buzz.sound("/audio-samples/Adb_Clp.wav"),
        new buzz.sound("/audio-samples/BD0000"),
        new buzz.sound("/audio-samples/BD0010"),
        new buzz.sound("/audio-samples/CP")
    ]);


    for (var i in buzz.group){
    	buzz.group[i].play();
    }
    */

    return module;
})();