var APP = APP || {};

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

APP.Plugins = (function () {

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
	 * provides the html hex code of the color
	 */
	function  getColor(cName) {
		switch(cName){
			case "light_yellow":	c = "#E6FB04";
			case "neon_red": 		c = "#FF0000";
			case "neon_purple": 	c = "#7CFC00";
			case "neon_pink":		c = "#FF00CC";
			case "neon_yellow":	c = "#FFFF00";
			case "neon_green":    c = "#00FF66";
			case "light_blue":       c = "#00FFFF";
			case "dark_blue":       c = "#0033FF";
			default: 					c = '#FAEBD7';
		}
    	return c;
	};
	
	module.getColor = getColor;
	module.getRandomColor = getRandomColor;
	return module;
})();




