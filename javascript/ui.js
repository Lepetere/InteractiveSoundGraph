// immediate function
document.UI = (function () {
	
	// module object; add all methods and properties that should be visible globally
    var module = {};
	
	var updateSoundList = function () {

		$('ul#sound-list').empty();
		var groupName = $('select#banch-select').find(':selected').attr('value');
		$(document.Sound.sounds[groupName]).each(function (sampleCounter, sample) {
			$('ul#sound-list').append('<li value="' + sampleCounter + '" class="sound-item">' + sample["name"] + '</li>');
		});
		$('.sound-item').click(soundClickHandler);
		document.Sound.currentSelection["groupName"] = groupName;

		// select and highlight first sound
		soundClickHandler.call($('.sound-item[value=0]'));
	};

	var highlightSelection = function (elementToHighlight) {
		$('#sound-list').children().each(function (counter, element) {
			$(element).css("color", "white");
		});
		$(elementToHighlight).css("color", "red");
	};
	
	var soundClickHandler = function () {
		var currentGroupName = document.Sound.currentSelection["groupName"];
		document.Sound.currentSelection["sampleName"] = document.Sound.sounds[currentGroupName][$(this).attr('value')]["name"];
		document.Sound.sounds[currentGroupName][$(this).attr('value')]["buzzObject"].play();
		var s = document.Sound.sounds[currentGroupName][$(this).attr('value')]["buzzObject"];

		highlightSelection(this);
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
			document.graph.toggleLoop();
			$('#loopOn, #loopOff').toggle();

			// deactivate clear button
			$('#clear').toggleClass('deactivate');
		});

		$('#soundToggle').click(function (e) {
			$('#soundOn, #soundOff').toggle();
			document.Sound.toggleSound();
		});

		$('#clear').click(function (e) {
			if (! $(this).hasClass('deactivate')) {
				document.graph.clear();
			}
		});

		/*
		 * show short instructions on mouse move over body element
		 */
		var instrFlag = false;
		$("body").hover(function() {
			if(instrFlag == false) {
				$("#instructionText").fadeIn("normal");
		           instrFlag = true;
		        }
		    });
		$("rect").mousedown(function() {
		        if(instrFlag == true) {
					$("#instructionText").fadeOut("normal");
		            //instrFlag = false;
		        }	
		    });
			
		/*
		 * show long instructions on mouse move over the info-button-element
		 */
		$("#info").hover(function() { $("#infoTextOnHover").fadeIn("normal"); },  function() { $("#infoTextOnHover").fadeOut("normal"); }  );
		
		/*
		 * popup window containing informations by click on info-button-element 
		 */
		var popupFlag = false;
			$("#info").click(function() {
		        if(popupFlag == false) {
		            $("#popup").fadeIn("normal");
		            popupFlag = true;
		        }
				return false;
		    }); 
		 	// close
		    $(".schliessen").click(function() {
		        if(popupFlag == true) {
					$("#popup").fadeOut("normal");
		            $("#popupHintergrund").fadeOut("normal");
		            popupFlag = false;
		            $("#msg").makeAbsolute(true, 10, 90);
		        }	
		    });

	};

    module.init = init;
    return module;
})();