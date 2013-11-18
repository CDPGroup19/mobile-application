var encryptedStorage = {
	
	init: function(key) {
		
		console.log("INITIALIZING ENCRYPTION");
		
		encryptedStorage.decrypt = function(data) {
			return sjcl.decrypt(key, data);
		};
		
		encryptedStorage.encrypt = function(data) {
			return sjcl.encrypt(key, data);
		};
		
	},

	removeItem: function(id) {
		window.localStorage.removeItem(id);
	},
	
	setItemUnencrypted: function(id, value) {
		value = (typeof value != 'string') ? JSON.stringify(value) : value;
		return window.localStorage.setItem(id, value);
	},
	
	getItemUnencrypted: function(id) {
		var value = window.localStorage.getItem(id);
		try {
			value = JSON.parse(value);
		} catch(e) {
			console.log("Failed to parse value: " + value);
		}
		return value;
	},
	
	setItem: function(id, value) {
		value = (typeof value != 'string') ? JSON.stringify(value) : value;
		return window.localStorage.setItem(id, encryptedStorage.encrypt(value));
	},
	
	getItem: function(id) {
		var value = encryptedStorage.decrypt(window.localStorage.getItem(id));
		try {
			value = JSON.parse(value);
		} catch(e) {
			console.log("Failed to parse value: " + value);
		}
		return value;
	}

};

var Session = function() {

	this.isAuthenticated = false;
	this.userData = null;
	this.logId = null;
	this.storage = encryptedStorage;

};

Session.prototype.__defineGetter__('AutoLoginConf', function() {
	return Number(this.storage.getItemUnencrypted('autoconfig'));
});

Session.prototype.removeAutoLogin = function() {
	this.storage.setItemUnencrypted('autouser', '{}');
	this.storage.setItemUnencrypted('autoconfig', 0);
};

Session.prototype.setAutoLogin = function(option) {
	this.storage.setItemUnencrypted('autouser', {
		username: this.userData.username,
		password: this.userData.password
	});
	this.storage.setItemUnencrypted('autoconfig', option);
	return true;
};

Session.prototype.tryAutoLogin = function() {

	if(!this.AutoLoginConf)
		return false;

	var autouser = this.storage.getItemUnencrypted('autouser');
	
	if(autouser.username && autouser.password) {
		return this.login(autouser.username, autouser.password);
	}

	return false;
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
		log: log.toSerializableObject()
	};
	
	var id = Date.now();
	
	// Push ID to user's logs
	this.userData.logs.push(id);
	
	// Update local user in storage
	this.updateCurrentUser();
	
	this.storage.setItem(
		this.getUserLogKey(this.userData.username, id),
		sessionLog
	);
	
	return id;

};

// Mark a local log as synched
Session.prototype.setLogSynched = function(id) {
	
	var logID = this.getUserLogKey(this.userData.username, id);
	var logData = this.storage.getItem(logID);
	
	if(logData.synched === true) {
		console.warn("Session: Synched a log which already was marked as synched.");
	}
	
	logData.synched = true;
	
	this.storage.setItem(logID, logData);
	

};

// Get a local trip log
Session.prototype.getLocalLog = function(id) {

	var logID = this.getUserLogKey(this.userData.username, id);
	var logData = this.storage.getItem(logID);
	
	return logData;

};

Session.prototype.removeStorageLogEntry = function(username, id) {
	
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
	
	this.updateCurrentUser();
	
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
	
	var attrs = ['birthyear', 'maritalStatus', 'numChildren', 'residence',
		'area', 'occupation'];
	
	for(var i = 0; i < attrs.length; i++) {
		if(this.userData.info[attrs[i]] !== undefined) {
			out[attrs[i] + "Id"] = Number(this.userData.info[attrs[i]]) || 0;
		}
	}
	
	var checks = ['Gender', 'subscription'];
	
	for(var i = 0; i < checks.length; i++) {
		var check = checks[i];
		var val = 0;
		if(this.userData.info[check] !== undefined) {
			var m = this.userData.info[check].match(/.*_(\d)$/);
			if(m !== null) {
				val = parseInt(m[1], 10);
			}
		}
		out[check + "Id"] = val;
	}
	
	return out;
};

Session.prototype.updateCurrentUserInfo = function(key, value) {
	
	this.userData.info[key] = value;
	
	this.updateCurrentUser();
	
};

// Update the stored object for active local user

Session.prototype.updateCurrentUser = function() {
	
	this.updateLocalUser(this.userData.username, this.userData);
	
};

Session.prototype.updateLocalUser = function(username, data) {
	
	this.storage.setItem(
		this.getUserKey(username), 
		data
	);
	
};


// Delete a user locally

Session.prototype.deleteLocalUser = function(username) {
	
	// Remove trips
	
	var userData = this.getStoredUserData(username);
	var logs = userData.logs.slice(0);
	
	for(var i = 0; i < logs.length; i++) {
		this.removeStorageLogEntry(username, logs[i]);
	}

	// Remove userdata entry from storage

	this.storage.removeItem(this.getUserKey(username));

};

// Checks if a user exists on the device

Session.prototype.hasUser = function(username) {

	var userDataEncrypted = this.storage.getItemUnencrypted(this.getUserKey(username));
	
	if(userDataEncrypted !== undefined && userDataEncrypted !== null) {
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
	
	// Sign data with password
	encryptedStorage.init(password);
	
	var userData = {
		username: username,
		password: password,
		logs: [],
		info: {}
	};
	
	this.storage.setItem(this.getUserKey(username), userData);
	
	return true;

};

Session.prototype.setUserPassword = function(username, password) {
	
	var data = this.getStoredUserData(username);
	
	if(data == null) {
		throw "Invalid user";
		//return false;
	}
	
	data.password = password;
	
	this.updateLocalUser(username, data);
	
	return true;
	
}

//  Load user data from local storage

Session.prototype.getStoredUserData = function(username) {

	var userData = this.storage.getItem(this.getUserKey(username));

	if(!userData) {
		return null;
	}
	
	return userData;

};

Session.prototype.setActiveLogId = function(value) {
	this.logId = value;
};

Session.prototype.getActiveLogId = function() {
	return this.logId;
};

Session.prototype.setActiveUser = function(value) {
	this.userData = this.userData || {};
	this.userData.username = value;
};

Session.prototype.getActiveUser = function() {
	if(this.userData && this.userData.username) {
		return this.userData.username;
	}
	return null;
};

Session.prototype.login = function(username, password) {

	encryptedStorage.init(password);

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
