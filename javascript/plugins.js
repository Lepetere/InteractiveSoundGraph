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

document.plugin = (function () {

	// module object; add all methods and properties that should be visible globally
	var module = {};

	module.getRandomColor =  function () {

		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}

    	return color;
	};

	return module;
})();




