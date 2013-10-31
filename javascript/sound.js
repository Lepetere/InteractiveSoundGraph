// immediate function
document.sound = (function () {

    var newSound = new buzz.sound("audio-samples/CP.mp3", {
        preload: true,
        autoplay: false,
    });

    // module object; add all methods and properties that should be visible globally
    var module = {};
    module.sound = newSound;
    return module;
})();