
$(document).ready(function() {

	/*
	 *menu click events
	 */
	document.getElementById('soundOff').onclick = function (e) {
	  console.log("soundOff");
	};

	document.getElementById('clear').onclick = function (e) {
	  console.log("clear");
	  document.graph.clear();

	};

	document.getElementById('info').onclick = function (e) {
	  console.log("info");
	};

	$(document).ready(function () {
	  document.UI.init();
	});
//////////////////////////////////// some effects //////////////////////////////////////////////////////////////
	/*
	 * popup for info
	 */
	var popupFlag = false;
		$("#info").click(function() {
	        if(popupFlag == false) {
	            $("#popup").fadeIn("normal");
	            popup_zustand = true;
	        }
			return false;
	    }); 
	 	//close popup, set msg object to the left side
	    $(".schliessen").click(function() {
	        if(popup_zustand == true) {
				$("#popup").fadeOut("normal");
	            $("#popupHintergrund").fadeOut("normal");
	            popup_zustand = false;
	            $("#msg").makeAbsolute(true, 10, 90);
	        }	
	    });
	
})(); //end main function