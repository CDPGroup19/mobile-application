var app = {
	
	session: null,
	location: null,
	isTracking: false,
	log: null,
	server: new ServerAPI("http://127.0.0.1/SmioIIS/BackendService.svc"),
	map: new MapHelper,

    // Application Constructor
    initialize: function() {
    
		console.log("Initializing application");
		
		app.session = new Session();
		app.location = new GeoLocation({}, app.onLocationUpdate);
		
		app.map.init();
		
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('load', this.onDeviceReady, false);
        
        //this.onDeviceReady();
        //window.addEventListener("load", this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        app.receivedEvent('deviceready');
        
        console.log("Device ready");
        
        $.mobile.changePage("pages/main.html");
        
        
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		
        console.log('Received Event: ' + id);
        
        var username, password, password2;
        
        switch(id) {
			
			case "onusercreation":
				
				console.log("Request to create new user");
				
				username = $("#usernameInput")[0].value;
				password = $("#passwordInput")[0].value;
				password2 = $("#passwordInputConfirm")[0].value;
				
				// @TODO validate input
				
				app.createUser(username, password);
				
				break;
				
			case "onloginrequest":
				
				username = $("#usernameInput")[0].value;
				password = $("#passwordInput")[0].value;
				
				app.signIn(username, password);
				
				break;
			
			case "loginsuccess":
				
				console.log("Login was OK");
				$.mobile.changePage("../pages/tracking.html");
				
				break;
			
			case "ontrackstart":
				
				app.startTracking();
				
				break;
				
			case "ontrackend":
				
				app.stopTracking();
				
				var tripPurpose = $("#selectDestination option:selected").val();
				
				app.log.Purpose = parseInt(tripPurpose, 10);
				
				$.mobile.changePage("../pages/trackingList.html");
				
				break;
			
			case "savetrip":
				// Save trip locally
				console.log("Saving trip locally");
				app.storeLocalTrip();
				
				console.log("changing to history page");
				
				$.mobile.changePage("../pages/history.html");
				
				// Add history
				$(document).bind("pageinit", function() {
				
					var logs = app.session.userData.logs;
				
					for(var i = 0; i < logs.length; i++) {
					
						var log_id = logs[i];
						var timestr = (new Date(log_id)).toLocaleString();
						
						var log = app.session.getLocalLog(log_id);
						
						var p = log.data.meta.purpose || -1;
						
						$("#logview").append("\
							<li><a href=\"#\">\
							<h3>" + timestr + "</h3>\
							<p>" + (Logger.TRIP_PURPOSE[p])  + "</p>\
							<span class=\"ui-li-count\">1</span>\
							<p class=\"ui-li-aside\">Aside</p>\
							</a></li>"
						);
					
					};
					
					$('#logview').listview('refresh');
				
				});
				
				break;
				
			case "uploadtrip":
				
				// Save locally and upload
				app.uploadTrip();
				
				console.log("Uploading trip");
				
				break;
				
			case "discardtrip":
				
				// Discard
				console.log("Discarding trip");
				
				// Go back to tracking
				$.mobile.changePage("../pages/tracking.html");
				
				break;
				
			default:
				
				console.warn("Unknown event " + id);
        }
        
    },
    
    storeLocalTrip: function() {
    
		if(!(this.log instanceof Logger)) {
			console.warn("App: Attempted to store local trip, but no trip was in memory!");
			return;
		}
		
		app.session.addLocalLog(this.log);
    
    },
    
    uploadTrip: function() {
		
		// Store locally before uploading
		app.storeLocalTrip();
		
		// @TODO
		
    },
    
    onLocationUpdate: function(data) {
		
		if(!app.isTracking) {
			console.warn("App: Received location update, but we're not tracking");
			return;
		}
		
		console.log("Received location update");
		
		app.log.addEntry(data);
		
		// Update map
		
		app.map.update(data);
		
    },
    
    startTracking: function() {
    
		if(app.isTracking) {
			console.warn("Tracking was started, but we're already tracking!");
			return;
		}
    
		app.isTracking = true;
		app.log = new Logger();
		app.location.start();
    
		console.log("Started tracking");
		
    },
    
    stopTracking: function() {
		
		if(!app.isTracking) {
			console.warn("Received request to stop tracking while tracking is inactive");
			return;
		}
		
		app.isTracking = false;
		app.location.stop();
		
		console.log("Stopped tracking");
		
    },
    
    /**
      * Create a new user
      * 
      **/
    createUser: function(username, password) {
		
		var onServerResponse = (function(response) {
		
			console.warn("SERVER RESPONSE: ", response);
		
			// @TODO create on remote server
			// Create locally for now
			
			var r = false;
			
			try {
				r = app.session.createLocalUser(username, password);
			} catch(e) {
				console.warn("App: User creation exception: " + e);
			}
			
			if(r === true) {
				// OK => sign in
				app.session.login(username, password);
				app.receivedEvent('loginsuccess');
			} else {
				console.warn("App: Failed to create local user");
			}
			
		
		}).bind(this);
		
		var userObj = {
			username: username,
			pinCode: password
		};
		
		//this.server.createUser(userObj, onServerResponse);
		onServerResponse();
		
    },
    
    /**
      * Sign in an existing user
      * 
      **/
    signIn: function(username, password) {
		
		var login_ok = false;
		var err_msg = "";
		
		try {
			
			login_ok = app.session.login(username, password);
						
		} catch(e) {
		
			err_msg = e;
			
		}
		
		if(login_ok)
			app.receivedEvent('loginsuccess');
		else {
			// @TODO: Handle login fail
			alert("Failed to sign in: " + err_msg);
		}
    
    },
    
};
