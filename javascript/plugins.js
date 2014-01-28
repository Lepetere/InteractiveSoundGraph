/*
 * additional functions
 */

 // set coordinates of html element to change its position
$.fn.setCoords = function(rebase, x, y){
    return this.each(function() {
        var el = $(this);
        var pos = el.position();
        el.css({ position: "absolute",
            marginLeft: 0, marginTop: 0,
            top: y, left: x });
        if (rebase)
            el.remove().appendTo("body");
    });
};

document.Plugins = (function () {

	// module object; add all methods and properties that should be visible globally
	var module = {};
	
	/*
	 * provides a random generated color
	 */
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
    	return color;
	};

	/*
	 * provides the color, according to the parameter of this function
	 */
	function  getColor(cName) {

		switch(cName){
			case "Chartreuse": 	c = "#7FFF00";
			case "LawnGreen": 	c = "#7CFC00";
			case "Lime":				c = "#00FF00";
			case "DarkOrange":	c = "#FF8C00";
			case "GreenYellow":  c = "#ADFF2F";
			default: 					c = '#FAEBD7';
		}
    	return c;
	};
	
	module.getColor = getColor;
	module.getRandomColor = getRandomColor;
	return module;
})();




