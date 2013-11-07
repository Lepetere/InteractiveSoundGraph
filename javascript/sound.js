// immediate function
document.Sound = (function () {

    // browser console cheat sheet:
    // new buzz.sound("audio-samples/sinusSynth4/gis4.mp3", {preload: true, autoplay: true});
    // document.Sound.sounds[0]["samples"][0]["buzzObject"].play();

    var BUZZ_NEW_SOUND_OPTIONS = {
        preload: true,
        autoplay: false,
    };

    // initialize an array containing sound objects for a scale
    var soundNames = [
                        {
                            groupName : "sinusSynth3", 
                            sampleNames : ["c3", "cis3", "d3", "dis3", "e3", "f3", "fis3", "g3", "gis3", "a3", "ais3", "b3"]
                        },
                        {
                            groupName : "sinusSynth4", 
                            sampleNames : ["c4", "cis4", "d4", "dis4", "e4", "f4", "fis4", "g4", "gis4", "a4", "ais4", "b4"]
                        },
                     ];
    var sounds = [];
    for (var i = soundNames.length; i--; ) {

        var groupName = soundNames[i]["groupName"];

        var group = {};
        group["groupName"] = groupName; 
        group["samples"] = [];
        
        for (var j = soundNames[i]["sampleNames"].length; j--; ) {
            var sampleName = soundNames[i]["sampleNames"][j];
            
            group["samples"].push({
                buzzObject: getSoundObject(groupName, sampleName),
                name: sampleName
            });
        }

        sounds.push(group);
    }

    var playAllSounds = function (banch, index) {

        if (document.Sound.sounds[banch]["samples"][index]["buzzObject"] != undefined) {
            document.Sound.sounds[banch]["samples"][index]["buzzObject"].play();
        }
        else {
            console.log("undefinded sound; index " + index);
        }

        var newIndex = index + 1;
      if (newIndex < document.Sound.sounds[banch]["samples"].length) {
        setTimeout(playAllSounds(banch, newIndex), 1000);
      }
    }

    function getSoundObject (group, name) {
        // console.log("get sound: " + group + "/" + name + ".mp3");
        return new buzz.sound("audio-samples/" + group + "/" + name + ".mp3", BUZZ_NEW_SOUND_OPTIONS);
    }

    // module object; add all methods and properties that should be visible globally
    var module = {};
    module.sounds = sounds;
    module.getSoundObject = getSoundObject;
    module.playAllSounds = playAllSounds;
    return module;
})();