// immediate function
document.UI = (function () {

	var updateSoundList = function () {

		$('ul#sound-list').empty();
		var groupName = $('select#banch-select').find(':selected').attr('value');
		$(document.Sound.sounds[groupName]).each(function (sampleCounter, sample) {
			$('ul#sound-list').append('<li value="' + sampleCounter + '">' + sample["name"] + '</li>');
		});
	};

	var init = function () {
		// init interface for sound selection
		// document.Sound.sounds[0]["samples"][0]["buzzObject"].play();
		var selected = " selected";
		$.each(document.Sound.sounds, function (groupName, samples) {
			$('select#banch-select').append('<option value="' + groupName + '"' + selected + '>' + groupName + '</option>');
			selected = "";
		});

		updateSoundList();
		$('select#banch-select').change(updateSoundList);
	};

	// module object; add all methods and properties that should be visible globally
    var module = {};
    module.init = init;
    return module;
})();