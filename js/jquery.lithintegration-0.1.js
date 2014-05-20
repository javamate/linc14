(function( $ ){
	var settings = {
			'boardId': ''
	};
	var methods = {
		init : function( options ) {
			// If options exist, lets merge them with our default settings
			if ( options ) { 
				$.extend( settings, options );
			}
		},
		postMessage : function () {
			
		},
		getMessages	: function () {
			
		}
	}
	$.fn.lithintegration = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.lithintegration' );
		}
	}
})( jQuery );