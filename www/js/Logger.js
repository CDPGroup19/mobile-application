/**
  * Data logger class. Contains the data for a trip.
  *
  **/
var Logger = function() {
	this.entries = [];
	// Meta data for the trip
	this.meta = {
		startTime: Date.now(),
		distance: 0,
		purpose: 0
	};
};

Logger.TRIP_PURPOSE = ({
	"-1": "Unknown",
	0: "Work",
	1: "Business",
	2: "School",
	3: "Accompany others",
	4: "Shopping service",
	5: "Leisure",
	6: "Home",
});

Logger.prototype.updateDistance = function(coords) {
	
	if(this._lastCoords !== undefined) {
		var d = Logger.getCoordPointDistance(this._lastCoords, coords);
		this.meta.distance += d;
	}
	
	this._lastCoords = coords;
	
	app.receivedEvent('distanceupdate');
	
};

/**
  * Add new entry to the log
  * 
  **/
Logger.prototype.addEntry = function(position) {

	console.log("Adding entry", position);


	this.updateDistance(position.coords);
	
	this.entries.push({
		timestamp: position.timestamp,
		latitude: position.coords.latitude,
		longitude: position.coords.longitude,
		altitude: position.coords.altitude,
		accuracy: position.coords.accuracy,
		altitudeAccuracy: position.coords.altitudeAccuracy,
		heading: position.coords.heading,
		speed: position.coords.speed
	});

};

Logger.prototype.__defineSetter__("Purpose", function(value) {
	this.meta.purpose = Number(value);
});

Logger.getCoordPointDistance = function(p0, p1) {
	
	var deg2rad = Math.PI / 180;
	var dlong = (p1.longitude - p0.longitude) * deg2rad;
	var dlat = (p1.latitude - p0.latitude) * deg2rad;
	var a = Math.pow(Math.sin(dlat / 2.0), 2) + Math.cos(p0.latitude * deg2rad) * Math.cos(p1.latitude * deg2rad) * Math.pow(Math.sin(dlong / 2.0), 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = 6367 * c;
	
	return d;
	
};

/** 
  * Get set of logger data with fields for server API/storage
  *
  **/
Logger.prototype.toSerializableObject = function() {
	
	var out = [];

	for(var i = 0; i < this.entries.length; i++) {
	
		var entry = this.entries[i];
	
		var outEntry = {};
		
		for(var i in entry) {
			if(entry[i] !== undefined && entry[i] !== null)
				outEntry[i] = entry[i];
		}
	
		out.push(outEntry);
	
	}

	return {
		meta: this.meta,
		entries: out
	};
};