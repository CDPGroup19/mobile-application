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
	// Meta data for the trip
	this.meta = {};
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

Logger.TRIP_PURPOSE = {
	-1: "Unknown",
	0: "Work",
	1: "Business",
	2: "School",
	3: "Accompany others",
	4: "Shopping service",
	5: "Leisure",
	6: "Home",
};

Logger.prototype.__defineSetter__("Purpose", function(value) {
	this.meta.purpose = Number(value);
});

/** 
  * Get set of logger data with fields for server API/storage
  *
  **/
Logger.prototype.toSerializableObject = function() {
	
	var out = [];

	for(var i = 0; i < this.entries.length; i++) {
	
		var entry = this.entries[i];
	
		out.push([entry.time, entry.latitude, entry.longitude]);
	
	}

	return {
		data: this.meta,
		entries: out
	};
};