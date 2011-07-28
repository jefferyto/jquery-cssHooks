/*! 
 * Copyright (c) 2011 Jeffery To (http://www.thingsthemselves.com/)
 * Clip and clip side (top, right, bottom, left) cssHooks for jQuery
 *
 * Limitations:
 * - Works with jQuery 1.4.3 and higher
 *
 * Licensed under the MIT License (LICENSE.txt).
 */
(function( $, document ) {
/*
 * Notes:
 *
 * - When accessing individual clip sides, a computed value is returned
 *   instead of "auto" (see the examples below).
 *
 * - Animation is also supported for clip sides.
 *
 *
 * Example usage:
 *
 * var div =
 *     $('<div/>')
 *         .css({ width: 100, height: 100, clip: 'auto' })
 *         .appendTo('body');
 *
 * alert(div.css('clip')); // "auto", except in WebKit and Opera (see
 *                         // browser bugs below)
 *
 * alert(div.css('clip-right')); // "100px", computed from "auto", again
 *                               // except in Webkit and Opera
 *
 * div
 *     .css('clip', 'rect(10px, 90px, 90px, 10px)')
 *     .css('clip-right', 80);
 *
 * alert(div.css('clip-right')); // "80px"
 *
 * alert(div.css('clip')); // "rect(10px, 80px, 90px, 10px)"
 *
 * div.animate({ clipRight: 10 }, function () {
 *     alert(div.css('clip-right')); // "10px"
 * });
 *
 *
 * Browser bugs (that can't be worked around by this plugin):
 *
 * - Opera 10.5+ returns "rect(A, A, C, C)" for elements with
 *   "clip: rect(A, B, C, D)", where A, B, C, D are pixel values
 *
 *   The element is rendered with the correct clipping, but the values
 *   returned by getComputedStyle are incorrect.
 *
 *   Opera bug ID: DSK-343270
 *
 * - Opera calculates relative lengths (em, and most likely ex) based on
 *   the font size of the parent element instead of the current element.
 *
 *   The element is rendered with incorrect clipping, and the values
 *   returned by getComputedStyle match the rendered clipping.
 *
 *   Opera bug ID: DSK-343344
 *
 * - WebKit and Opera returns "rect(0px, 0px, 0px, 0px)" for elements
 *   with "clip: auto" or "clip: rect(auto, auto, auto, auto)".
 *
 *   Opera also returns "rect(0px, 0px, 0px, 0px)" if the element has no
 *   clip declaration (which defaults to "auto")
 *
 *   WebKit bug report: https://bugs.webkit.org/show_bug.cgi?id=20454
 *   Opera bug ID: DSK-343270
 *
 *
 * Properties added to jQuery.support:
 *
 * - getClip
 *   true if clip values are correctly returned by the browser, false
 *   otherwise (Opera 10.5+)
 *
 * - getClipAuto
 *   true if the browser correctly returns "auto" (Firefox, IE), false
 *   otherwise (WebKit, Opera)
 *
 *   For browsers where getClipAuto is false, "rect(0px, 0px, 0px, 0px)"
 *   is returned instead of "auto", and so there is no
 *   way to tell if the element is visible or completely clipped. In
 *   this case, a workaround is to set a definite clip value, either in
 *   CSS or JS and avoid "auto".
 *
 * - setClipAuto
 *   true if the browser supports setting clip to "auto" through
 *   JavaScript, false otherwise (IE6-7)
 *
 *   IE6-7 will throw an error if you try to setting clip to "auto",
 *   e.g. element.style.clip = 'auto'.
 *   Setting the equivalent "rect(auto, auto, auto, auto)" is safe.
 *   (This plugin will automatically work around this issue.)
 *
 * - relativeClip
 *   true if relative clip values are handled correctly by the browser,
 *   false otherwise (Opera)
 */

	if ( !$.cssHooks ) {
		$.error( "jQuery 1.4.3+ is needed for the clip plugin to work" );
		return;
	}

	var sides = [ "top", "right", "bottom", "left" ],
		auto = "auto",
		getComputed, getComputedSide;

	// do tests, set properties on $.support
	// test elements / fake body code shamelessly stolen from jQuery (1.6.2)
	(function() {
		var div = document.createElement( "div" ),
			body = document.getElementsByTagName( "body" )[ 0 ],
			testElementParent = body || document.documentElement,
			testElement = document.createElement( body ? "div" : "body" ),
			testElementStyle = {
				visibility: "hidden",
				width: 0,
				height: 0,
				border: 0,
				margin: 0,
				fontSize: "2px"
			},
			rect = "rect(1px 4px 2px 3px)",
			setClip = function( rect ) { div.style.clip = rect; },
			getClip, i;

		div.style.position = "absolute";
		div.style.fontSize = "1px";
		if ( body ) {
			$.extend( testElementStyle, {
				position: "absolute",
				left: -1000,
				top: -1000
			} );
		}
		for ( i in testElementStyle ) {
			testElement.style[ i ] = testElementStyle[ i ];
		}
		testElement.appendChild( div );
		testElementParent.insertBefore( testElement, testElementParent.firstChild );

		$.extend( $.support, {
			getClip: true,
			getClipAuto: true,
			setClipAuto: true,
			relativeClip: true
		} );

		// IE6-7 will throw an error if we try to set clip to "auto"
		try {
			setClip( auto );
		} catch ( e ) {
			$.support.setClipAuto = false;
		}

		if ( document.defaultView && document.defaultView.getComputedStyle ) {
			getClip = function() {
				return ( document.defaultView.getComputedStyle( div, null ) || { clip: "" } ).clip.replace( /,/g, "" );
			};

			setClip( "rect(auto auto auto auto)" );
			$.support.getClipAuto = /auto/.test( getClip() );

			setClip( rect );
			$.support.getClip = getClip() === rect;

			setClip( rect.replace( /px/g, "em" ) );
			$.support.relativeClip = getClip() === rect;
		}

		testElement.innerHTML = "";
		testElementParent.removeChild( testElement );
		testElement = body = div = getClip = setClip = null;
	})();

	function normalize( rect ) {
		return rect.replace( /[\s,]+/g, ", " )
			.replace( "rect(auto, auto, auto, auto)", auto );
	}

	function split( rect ) {
		var obj = {};
		rect = rect
			.replace( /^auto$/, "auto auto auto auto" )
			.replace( "rect(", "" )
			.replace( ")", "" )
			.split( /[\s,]+/ );
		$.each( sides, function( i, side ) {
			obj[ side ] = rect[ i ] || "";
		} );
		return obj;
	}

	function join( obj ) {
		var buf = [];
		$.each( sides, function( i, side ) {
			buf.push( obj[ side ] );
		} );
		return normalize( "rect(" + buf.join( " " )  + ")" );
	}

	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		// in standards-loving browsers, use getComputedStyle
		// use jQuery's default method to get the value, then normalize
		getComputed = function( elem ) {
			return normalize( $.css( elem, "clip", true ) );
		};
		getComputedSide = function( elem, side ) {
			return split( $.css( elem, "clip" ) )[ side ];
		};

	} else {
		// in IE, clip is split into clipTop, clipRight, etc. on currenStyle
		// use jQuery's default method to read the four clip properties, then assemble
		getComputed = function( elem ) {
			var obj = {};
			$.each( sides, function( i, side ) {
				obj[ side ] = $.css( elem, $.camelCase( "clip-" + side ), true );
			} );
			return join( obj );
		};
		getComputedSide = function( elem, side ) {
			return $.css( elem, $.camelCase( "clip-" + side ), true );
		};
	}

	$.cssHooks.clip = {
		get: function( elem, computed, extra ) {
			var val;
			if ( !extra ) {
				val = computed ?
					getComputed( elem ) :
					normalize( elem.style.clip );
			}
			return val;
		},

		set: $.support.setClipAuto ?
			function( elem, value ) { elem.style.clip = value; } :
			function( elem, value ) {
				elem.style.clip = $.trim( value ).toLowerCase() === auto ?
					"rect(auto auto auto auto)" :
					value;
			}
	};

	$.each( sides, function( i, side ) {
		var clipSide = $.camelCase( "clip-" + side );

		$.cssHooks[ clipSide ] = {
			get: function( elem, computed, extra ) {
				var val;
				if ( !extra ) {
					if ( computed ) {
						if ( ( val = getComputedSide( elem, side ) ) === auto ) {
							switch ( side ) {
							case "right":
								val = $.css( elem, "width", "border" );
								break;
							case "bottom":
								val = $.css( elem, "height", "border" );
								break;
							default:
								val = "0px";
							}
						}

					} else {
						val = split( elem.style.clip )[ side ];
					}
				}
				return val;
			},

			set: function( elem, value ) {
				var obj = split( $.css( elem, "clip" ) );
				obj[ side ] = value;
				$.cssHooks.clip.set( elem, join( obj ) );
			}
		};

		$.fx.step[ clipSide ] = function( fx ) {
			$.cssHooks[ clipSide ].set( fx.elem, fx.now + fx.unit );
		};
	} );

	// XXX support full clip animation?

})( jQuery, document );
