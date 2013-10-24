var newSound = new buzz.sound("audio-samples/Adb_Clp.wav", {
    preload: true,
    autoplay: false,
});

// play as soon as possible on load
newSound.bind( "canplay", function () {
	newSound.play();
} );

document.addEventListener("keyup", function (event) {
    if (!event) event = window.event;
    var keyCode = event.keyCode || event.which;
    if(keyCode == '13' ) { // enter key
        console.log("press enter");
        newSound.play();
    }
});
