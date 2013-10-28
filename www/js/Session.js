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
	return this.getUserKey(username) + "-" + logId;
};

Session.prototype.checkUserData = function(userData) {
	
	if(!(userData.logs instanceof Array))
		userData.logs = [];
	
	if(!(userData.info instanceof Object))
		userData.info = {};
	
};

// Add a log object to the local storage
Session.prototype.addLocalLog = function(log) {

	var sessionLog = {
		synched: false,
		data: log.toSerializableObject()
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

Session.prototype.removedStorageLogEntry = function(username, id) {
	
	var logID = this.getUserLogKey(username, id);
	
	this.storage.removeItem(logID);
	
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
	
	this.removeStorageLogEntry(this.userData.username, id);

};

Session.prototype.getLocalUserInfo = function(key) {
	
	var data = this.userData.info[key];
	
	return data == undefined ? "none" : data;
			
};

// Get a serializable info object for the active user

Session.prototype.getUserInfoObject = function() {
	
	var out = {};
	
	var attrs = ['birthyear', 'martialStatus', 'numChildren', 'residence',
		'area', 'occupation'];
	
	for(var i = 0; i < attrs.length; i++) {
		if(this.userData.info[attrs[i]] !== undefined) {
			out[attrs[i]] = Number(this.userData.info[attrs[i]]) || 0;
		}
	}
	
	out.Gender = this.userData.info.Gender !== undefined
			? (this.userData.info.Gender == "male" ? 1 : 2)
			: 0;
	
	out.travelcard = this.userData.info.travelcard !== undefined
			? (this.userData.info.travelcard == "travelcard_yes" ? 1 : 2)
			: 0;
	
	return out;
};

Session.prototype.updateLocalUserInfo = function(key, value) {
	
	this.userData.info[key] = value;
	
	this.updateLocalUser();
	
};

// Update the stored object for active local user

Session.prototype.updateLocalUser = function() {
	
	this.storage.setItem(
		this.getUserKey(this.userData.username), 
		JSON.stringify(this.userData)
	);
	
};

// Delete a user locally

Session.prototype.deleteLocalUser = function(username) {
	
	// Remove trips
	
	var userData = this.getStoredUserData(username);
	var logs = userData.logs.slice(0);
	
	for(var i = 0; i < logs.length; i++) {
		this.removedStorageLogEntry(username, logs[i]);
	}

	// Remove userdata entry from storage

	this.storage.removeItem(this.getUserKey(username));

};

// Checks if a user exists on the device

Session.prototype.hasUser = function(username) {

	var userDataJSON = this.storage.getItem(this.getUserKey(username));
	
	if(userDataJSON !== undefined && userDataJSON !== null) {
		return true;
	}
	
	return false;

};

// Create a user locally on the device

Session.prototype.createLocalUser = function(username, password) {

	if(!username)
		throw "No username";

	if(!password)
		throw "No password";

	if(username.length < 4)
		throw "Invalid length for username";

	if(password.length < 4)
		throw "Invalid password length";

	// Don't allow creation if user already exists
	if(this.hasUser(username)) {
		console.log("Session: Account creation: Username is taken ...");
		return false;
	}
	
	var userData = {
		username: username,
		password: password,
		logs: [],
		info: {}
	};
	
	this.storage.setItem(this.getUserKey(username), JSON.stringify(userData));
	
	return true;

};

//  Load user data from local storage

Session.prototype.getStoredUserData = function(username) {

	var userDataJSON = this.storage.getItem(this.getUserKey(username));

	if(!userDataJSON) {
		throw "User doesn't exist";
	}

	var userData = JSON.parse(userDataJSON);
	
	return userData;

};

Session.prototype.login = function(username, password) {

	if(!this.hasUser(username))
		return false;
	
	var userData = this.getStoredUserData(username);
	
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
