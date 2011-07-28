module("clip");

test("clip", 2, function() {
    equals( jQuery("#test").css("clip"), "rect(1px, 4px, 3px, 2px)", "returns correct values" );
    equals( jQuery("#test").css("clip", "rect(10px, 40px, 30px, 20px)").css("clip"), "rect(10px, 40px, 30px, 20px)", "sets correct values" );
});

test("clip-top", 3, function() {
    equals( jQuery("#test").css("clip-top"), "1px", "returns correct value" );
    equals( jQuery("#test").css("clip-top", "5px").css("clip"), "rect(5px, 4px, 3px, 2px)", "sets correct value" );
    stop();
    jQuery("#test").animate({ clipTop: 10 }, 100, function() {
        equals( jQuery("#test").css("clip-top"), "10px", "animates the value properly" );
        start();
    });
});

test("clip-right", 3, function() {
    equals( jQuery("#test").css("clip-right"), "4px", "returns correct value" );
    equals( jQuery("#test").css("clip-right", "5px").css("clip"), "rect(1px, 5px, 3px, 2px)", "sets correct value" );
    stop();
    jQuery("#test").animate({ clipRight: 10 }, 100, function() {
        equals( jQuery("#test").css("clip-right"), "10px", "animates the value properly" );
        start();
    });
});

test("clip-bottom", 3, function() {
    equals( jQuery("#test").css("clip-bottom"), "3px", "returns correct value" );
    equals( jQuery("#test").css("clip-bottom", "5px").css("clip"), "rect(1px, 4px, 5px, 2px)", "sets correct value" );
    stop();
    jQuery("#test").animate({ clipBottom: 10 }, 100, function() {
        equals( jQuery("#test").css("clip-bottom"), "10px", "animates the value properly" );
        start();
    });
});

test("clip-left", 3, function() {
    equals( jQuery("#test").css("clip-left"), "2px", "returns correct value" );
    equals( jQuery("#test").css("clip-left", "5px").css("clip"), "rect(1px, 4px, 3px, 5px)", "sets correct value" );
    stop();
    jQuery("#test").animate({ clipLeft: 10 }, 100, function() {
        equals( jQuery("#test").css("clip-left"), "10px", "animates the value properly" );
        start();
    });
});

test("auto", 5, function() {
    jQuery("#test").css("clip", "auto");
    equals( jQuery("#test").css("clip"), "auto", "clip returns correct value" );
    equals( jQuery("#test").css("clip-top"), "0px", "clip-top returns correct computed value" );
    equals( jQuery("#test").css("clip-right"), jQuery("#test").outerWidth() + "px", "clip-right returns correct computed value" );
    equals( jQuery("#test").css("clip-bottom"), jQuery("#test").outerHeight() + "px", "clip-bottom returns correct computed value" );
    equals( jQuery("#test").css("clip-left"), "0px", "clip-left returns correct computed value" );
});

test("rect(auto, auto, auto, auto)", 5, function() {
    jQuery("#test").css("clip", "rect(auto, auto, auto, auto)");
    equals( jQuery("#test").css("clip"), "auto", "clip returns correct value" );
    equals( jQuery("#test").css("clip-top"), "0px", "clip-top returns correct computed value" );
    equals( jQuery("#test").css("clip-right"), jQuery("#test").outerWidth() + "px", "clip-right returns correct computed value" );
    equals( jQuery("#test").css("clip-bottom"), jQuery("#test").outerHeight() + "px", "clip-bottom returns correct computed value" );
    equals( jQuery("#test").css("clip-left"), "0px", "clip-left returns correct computed value" );
});

test("relative values", 5, function() {
    jQuery("#test").css({ fontSize: "10px", clip: "rect(1em, 4em, 3em, 2em)" });
    equals( jQuery("#test").css("clip"), "rect(10px, 40px, 30px, 20px)", "clip returns correct values" );
    equals( jQuery("#test").css("clip-top"), "10px", "clip-top returns correct value" );
    equals( jQuery("#test").css("clip-right"), "40px", "clip-right returns correct value" );
    equals( jQuery("#test").css("clip-bottom"), "30px", "clip-bottom returns correct value" );
    equals( jQuery("#test").css("clip-left"), "20px", "clip-left returns correct value" );
});

