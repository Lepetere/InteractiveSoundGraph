document.addEventListener("keyup", function (event) {
    if (!event) event = window.event;
    var keyCode = event.keyCode || event.which;
    if(keyCode == '13' ) { // enter key
        newSound.play();
    }
});

document.getElementById('soundOff').onclick = function (e) {
  console.log("soundOff");
};

document.getElementById('clear').onclick = function (e) {
  console.log("clear");
};

document.getElementById('info').onclick = function (e) {
  console.log("info");
};