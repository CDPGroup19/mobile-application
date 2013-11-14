var GeoLocation = function( options, callback ) {

	options = options || {};
	
	options.enableHighAccuracy = options.enableHighAccuracy || true;
	options.maximumAge = options.maximumAge || 1000;
	options.timeout = options.timeout || 1000 * 60 * 4;
	
	var lastUpdateTime = Date.now();
	var watchId = null;
	var numErrors = 0;
	
	var rsIntId = null;
	var RESTART_TIMEOUT = 3000;
	
	var onSuccess = function( position ) {
		lastUpdateTime = Date.now();
		callback( position );
	};
	
	var onError = function() {
		lastUpdateTime = Date.now();
		if( ++numErrors >= 3 ) {
			restart();
		}
	};
	
	var stop = function() {
		
		if( watchId !== null ) {
			navigator.geolocation.clearWatch( watchId );
		}
		
		if(rsIntId !== null) {
			clearInterval(rsIntId);
		}
		
	};
	
	var start = function() {
		numErrors = 0;
		watchId = navigator.geolocation.watchPosition(
			onSuccess,
			onError,
			options
		);
		
		/* Periodically check if nothing has been received. */
		
		rsIntId = setInterval(function() {
			if(Date.now() - lastUpdateTime >= RESTART_TIMEOUT) {
				// Hard reset
				restart();
			}
		}, RESTART_TIMEOUT);
		
	};
	
	var restart = function() {
		stop();
		start();
	};
	
	// Public
	
	this.__defineSetter__("callback", function( value ) {
		callback = value;
	});
	
	this.start = start;
	this.stop = stop;
	
};