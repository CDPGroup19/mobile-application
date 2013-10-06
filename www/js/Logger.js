/**
  * Class for log entry
  * 
  **/
var LogEntry = function(time, latitude, longitude) {
	this.time = time;
	this.latitude = latitude;
	this.longitude = longitude;
};

/**
  * Data logger class. Contains the data for a trip.
  *
  **/
var Logger = function() {
	this.startTime = Date.now();
	this.entries = [];
};

/**
  * Add new entry to the log
  * 
  **/
Logger.prototype.addEntry = function(position) {

	console.log("Adding entry", position);

	this.entries.push(new LogEntry(
		position.timestamp,
		position.coords.latitude,
		position.coords.longitude
	));

};

/** 
  * Get set of logger data with fields for server API
  *
  **/
Logger.prototype.createObject = function() {
	
	var out = [];

	for(var i = 0; i < this.entries.length; i++) {
	
		var entry = this.entries[i];
	
		out.push([entry.time, entry.latitude, entry.longitude]);
	
	}

	return out;
	
};