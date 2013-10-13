var Session = function() {

	this.isAuthenticated = false;
	this.userData = null;

	this.storage = window.localStorage;

};

// Get storage key for user
Session.prototype.getUserKey = function(username) {
	return "user-" + username;
};

// Get storage key for user trip log
Session.prototype.getUserLogKey = function(username, logId) {
	return this.getUserKey() + "-" + logId;
};

Session.prototype.checkUserData = function(userData) {
	
	if(!(userData.logs instanceof Array))
		userData.logs = [];
	
};

// Add a log object to the local storage
Session.prototype.addLocalLog = function(log) {

	var sessionLog = {
		synched: false,
		data: log.toObject()
	};

	var logDataJSON = JSON.stringify(sessionLog);
	var id = Date.now();
	
	// Push ID to user's logs
	this.userData.logs.push(id);
	
	// Update local user in storage
	this.updateLocalUser();
	
	this.storage.setItem(
		this.getUserLogKey(this.userData.username, id),
		logDataJSON
	);
	
	return id;

};

// Mark a local log as synched
Session.prototype.setLogSynched = function(id) {
	
	var logID = this.getUserLogKey(this.userData.username, id);
	var logDataJSON = this.storage.getItem(logID);
	var logData = JSON.parse(logDataJSON);
	
	if(logData.synched === true) {
		console.warn("Session: Synched a log which already was marked as synched.");
	}
	
	logData.synched = true;
	
	this.storage.setItem(logID, JSON.stringify(logData));
	

};

// Get a local trip log
Session.prototype.getLocalLog = function(id) {

	var logID = this.getUserLogKey(this.userData.username, id);
	var logDataJSON = this.storage.getItem(logID);
	var logData = JSON.parse(logDataJSON);
	
	return logData;

};

// Remove a trip log from the local storage
Session.prototype.removeLocalLog = function(id) {
	
	var idx = this.userData.logs.indexOf(id);
	
	if(idx < 0) {
		console.warn("Session: Asked to remove invalid log");
		return;
	}
	
	// Remove from user's log list
	
	this.userData.logs.splice(idx, 1);
	
	// Update user data in storage
	
	this.updateLocalUser();
	
	// Remove trip data from storage
	
	var logID = this.getUserLogKey(this.userData.username, id);
	
	this.storage.removeItem(logID);

};

// Update the storaged object for active local user
Session.prototype.updateLocalUser = function() {
	
	this.storage.setItem(
		this.getUserKey(username), 
		JSON.stringify(this.userData)
	);
	
};

Session.prototype.deleteLocalUser = function(username) {

	// Check password?

	this.storage.removeItem(this.getUserKey(username));

};

Session.prototype.createLocalUser = function(username, password) {

	if(!username)
		throw "No username";

	if(!password)
		throw "No password";

	if(username.length < 4)
		throw "Invalid length for username";

	if(password.length < 4)
		throw "Invalid password length";

	var userData = {
		username: username,
		password: password,
		logs: [],
	};
	
	this.storage.setItem(this.getUserKey(username), JSON.stringify(userData));

};

Session.prototype.login = function(username, password) {

	var userDataJSON = this.storage.getItem(this.getUserKey(username));

	if(!userDataJSON) {
		throw "User doesn't exist";
	}

	var userData = JSON.parse(userDataJSON);
	
	this.checkUserData(userData);
	
	if(userData.password && userData.password == password) {
	
		console.log("Authentication OK!", userData);
		this.isAuthenticated = true;
		this.userData = userData;
		
		return true;
	
	}
	
	console.log("Wrong password");
	
	return false;

};
