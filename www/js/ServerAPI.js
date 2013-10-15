/**
  * Class for server communication
  *
  **/
var ServerAPI = function(serverUri) {
	
	this.serverUri = serverUri;
	
	// temporary
	//this.serverUri = "http://localhost/SmioIIS/BackendService.svc";
	
};

ServerAPI.Request = {
	INSERT_USER: "InsertNewUser",
	INSERT_TRIP: "InsertTripData",
};

ServerAPI.prototype.getUri = function(action) {

	var uriComponents = [
		this.serverUri,
		action
	];

	return uriComponents.join("/");

};

ServerAPI.prototype.submitData = function(action, obj, callback) {

	var objJSON = JSON.stringify(obj);
	var xmlhttp = new XMLHttpRequest();

	var apiUri = this.getUri(action);
	var _callback = this.onServerResponse.bind(this, callback);

	$.ajax({
		type: 'POST',
		url: apiUri,
		contentType: "application/json",
		crossDomain: true,
		dataType: XMLHttpRequest,
		success: _callback,
		error: function(e) {
			console.warn("Ajax error", e);
		},
	});
	
};

ServerAPI.prototype.onServerResponse = function(callback, responseText) {
	
	var obj = JSON.parse(responseText);
	
	callback(obj);
	
	// @TODO: Handle server response
	
};

/**
  * Create a new user
  * 
  **/
ServerAPI.prototype.createUser = function(userObj, callback) {

	console.log("ServerAPI: Inserting new user", userObj);
	this.submitData(ServerAPI.Request.INSERT_USER, userObj, callback);

};

ServerAPI.prototype.submitReport = function(obj, callback) {

	// @TODO
	this.submitData(ServerAPI.Request.INSERT_TRIP, obj, callback);

};