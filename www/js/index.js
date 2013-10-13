var app = {
	
	session: null,
	location: null,
	tracking: false,
	log: null,

    // Application Constructor
    initialize: function() {
    
		console.log("Initializing application");
		
		app.session = new Session();
		app.location = new GeoLocation({}, app.onLocationUpdate);
		
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
				$.mobile.changePage("../pages/trackingList.html");
			break;
			case "savetrip":
				// Save trip locally
				console.log("Saving trip locally");
				app.storeLocalTrip();
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
		}
		
		app.session.addLocalLog(this.log);
    
    },
    
    uploadTrip: function() {
		
		// Store locally before uploading
		app.storeLocalTrip();
		
		// @TODO
		
    },
    
    onLocationUpdate: function(data) {
		
		if(!app.tracking) {
			console.warn("App: Received location update, but we're not tracking");
			return;
		}
		
		console.log("Received location update");
		
		app.log.addEntry(data);
		
    },
    
    startTracking: function() {
    
		if(app.tracking) {
			console.warn("Tracking was started, but we're already tracking!");
			return;
		}
    
		app.tracking = true;
		app.log = new Logger();
		app.location.start();
    
		console.log("Started tracking");
		
    },
    
    stopTracking: function() {
		
		if(!app.tracking) {
			console.warn("Received request to stop tracking while tracking is inactive");
			return;
		}
		
		app.tracking = false;
		app.location.stop();
		
		console.log("Stopped tracking");
		
    },
    
    /**
      * Create a new user
      * 
      **/
    createUser: function(username, password) {
    
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
