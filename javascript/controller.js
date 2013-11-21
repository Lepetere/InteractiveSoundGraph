// debugging: get time for loading the module
//var start =  new Date().getTime();
var start2 =  new Date().getTime();
//console.log("controller.js start :"+ start);

$(document).ready(function () {
  document.UI.init();
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
var end2 = new Date().getTime();
//console.log("controller.js end:"+  end );
var time2 = end2 - start2;
console.log("loading time for controller.js :   " + time2);
