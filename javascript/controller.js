// debugging: get time for loading the module
var start =  new Date().getTime();
console.log("controller.js start :"+ start);

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
	
	$(loop).mousedown(function () {
		console.log("loop - klick");
		document.graph.setLoopFlag();
		});
//////////////////////////////////// some effects //////////////////////////////////////////////////////////////
	// show short instructions on mouse move 
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
	 * popup for info
	 */
	var popupFlag = false;
		$("#info").click(function() {
	        if(popupFlag == false) {
	            $("#popup").fadeIn("normal");
	            popupFlag = true;
	        }
			return false;
	    }); 
	 	//close popup, set msg object to the left side
	    $(".schliessen").click(function() {
	        if(popupFlag == true) {
				$("#popup").fadeOut("normal");
	            $("#popupHintergrund").fadeOut("normal");
	            popupFlag = false;
	            $("#msg").makeAbsolute(true, 10, 90);
	        }	
	    });

// debugging: get time for loading the module
var end = new Date().getTime();
console.log("controller.js end:"+  end );
var time = end - start;
console.log("time controller.js :   " + time);