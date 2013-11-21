// immediate function
document.UI = (function () {
	
	// module object; add all methods and properties that should be visible globally
    var module = {};
	module.theSounds = [];
	
	var updateSoundList = function () {

		$('ul#sound-list').empty();
		var groupName = $('select#banch-select').find(':selected').attr('value');
		$(document.Sound.sounds[groupName]).each(function (sampleCounter, sample) {
			$('ul#sound-list').append('<li value="' + sampleCounter + '" class="sound-item">' + sample["name"] + '</li>');
		});
		$('.sound-item').click(soundClickHandler);
		document.Sound.currentSelection["groupName"] = groupName;
	};
	
	var soundClickHandler = function () {
		var currentGroupName = document.Sound.currentSelection["groupName"];
		document.Sound.currentSelection["sampleName"] = document.Sound.sounds[currentGroupName][$(this).attr('value')]["name"];
		document.Sound.sounds[currentGroupName][$(this).attr('value')]["buzzObject"].play();
		var s = document.Sound.sounds[currentGroupName][$(this).attr('value')]["buzzObject"]
		//save last played(on klick) sound in array
		module.theSounds.push(s);
	};

	var init = function () {

		// init interface for sound selection
		var selected = " selected";
		$.each(document.Sound.sounds, function (groupName, samples) {
			$('select#banch-select').append('<option value="' + groupName + '"' + selected + '>' + groupName + '</option>');
			selected = ""; // only add selected attribute to first option
		});

		updateSoundList();

		// assign event handlers
		$('select#banch-select').change(updateSoundList);

		/*
		 *menu click events
		 */

		$('#loopToggle').click(function (e) {
			document.graph.setLoopFlag();
			$('#loopOn, #loopOff').toggle();
		});

		$('#soundToggle').click(function (e) {
			$('#soundOn, #soundOff').toggle();
		});

		$('#clear').click(function (e) {
			console.log("clear");
			document.graph.clear();
		});

	};

    module.init = init;
    return module;
})();