/*
 * additional functions
 */

 // set coordinates of html element to change its position
$.fn.makeAbsolute = function(rebase, x, y){
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