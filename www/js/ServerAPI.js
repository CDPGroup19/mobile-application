/**
  * Class for server communication
  *
  **/
var ServerAPI = function(serverUri) {
	
	this.serverUri = serverUri;
	
	// temporary
	this.serverUri = "http://localhost/SmioIIS/BackendService.svc";
	
};

ServerAPI.Request = {
	INSERT_USER: "InsertNewUser",
};

ServerAPI.prototype.getUri = function(action) {

	var uriComponents = [
		this.serverUri,
		action
	];

	return uriComponents.join("/");

};

ServerAPI.prototype.submitData = function(action, obj) {

	var objJSON = JSON.stringify(obj);
	var xmlhttp = new XMLHttpRequest();

	var apiUri = this.getUri(action);
	var callback = this.onServerResponse.bind(this);

	xmlhttp.open("POST", apiUri, true);
	xmlhttp.setRequestHeader("Content-type","application/json; charset=utf-8");
	
	xmlhttp.onreadystatechange = function() {           
		if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
			callback(xmlhttp.responseText);
		}
		// @TODO: error handling
		console.log("ServerAPI: State change, status=" + xmlhttp.status);
	}
	
	xmlhttp.send(objJSON);
	
};

ServerAPI.prototype.onServerResponse = function(response_str) {
	
	var obj = JSON.parse(response_str);
	
	// @TODO: Handle server response
	
};

/**
  * Create a new user
  * 
  **/
ServerAPI.prototype.createUser = function(userObj) {

	console.log("ServerAPI: Inserting new user", userObj);
	this.submitData(ServerAPI.Request.INSERT_USER, userObj);

};

ServerAPI.prototype.submitReport = function() {

	// @TODO

};