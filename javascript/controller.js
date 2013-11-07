console.log("Graph module: " + document.Graph);
console.log("Sound module: " + document.Sound);
console.log("UI module: " + document.UI);

/*document.addEventListener("keyup", function (event) {
    if (!event) event = window.event;
    var keyCode = event.keyCode || event.which;
    if(keyCode == '13' ) { // enter key
    	if (!document.sound.sound.isEnded()) {
    		document.sound.sound.stop();	
    	}
        document.sound.sound.play();
    }
});*/

// menu click events
document.getElementById('soundOff').onclick = function (e) {
  console.log("soundOff");
};

document.getElementById('clear').onclick = function (e) {
  console.log("clear");
  document.Graph.restart();
};

document.getElementById('info').onclick = function (e) {
  console.log("info");
};

window.onload = function () {
  // document.Sound.playAllSounds(0, 0);
};

$(document).ready(function () {
  document.UI.init();
});