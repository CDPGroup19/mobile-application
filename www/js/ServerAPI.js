/**
  * Class for server communication
  *
  **/
var ServerAPI = function(serverUri) {
	
	this.serverUri = serverUri;
	
};

ServerAPI.Request = {
	INSERT_USER: "InsertNewUserREST",
	INSERT_TRIP: "InsertTripDataREST",
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

	console.log("Sending this:", objJSON);

	$.ajax({
		type: 'POST',
		url: apiUri,
		data: objJSON,
		contentType: "application/json",
		crossDomain: true,
		//dataType: XMLHttpRequest,
		dataType: 'json',
		success: _callback,
		error: function(e) {
			console.warn("Ajax error", e);
			window.wtf = e.responseText;
		},
	});
	
};

ServerAPI.prototype.onServerResponse = function(callback, obj) {
	
	console.log("onserverresponse", obj);
	
	// @TODO: Handle server response in case of error
	
	callback(obj);
	
	
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