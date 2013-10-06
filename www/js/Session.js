var Session = function() {

	this.isAuthenticated = false;
	this.userData = null;

	this.storage = window.localStorage;
	this.tempStorage = window.sessionStorage;

};

Session.prototype.createUser = function(username, password) {
	
};

Session.prototype.getUserKey = function(username) {
	return "user-" + username;
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
		password: password
	};
	
	this.storage.setItem(this.getUserKey(username), JSON.stringify(userData));

};

Session.prototype.login = function(username, password) {

	var userDataJSON = this.storage.getItem(this.getUserKey(username));

	if(!userDataJSON) {
		throw "User doesn't exist";
	}

	var userData = JSON.parse(userDataJSON);
	
	//this.validateUserData(userData);
	
	if(userData.password && userData.password == password) {
	
		console.log("Authentication OK!", userData);
		this.isAuthenticated = true;
		this.userData = userData;
		
		return true;
	
	}
	
	console.log("Wrong password");
	
	return false;

};
