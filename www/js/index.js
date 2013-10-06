var app = {
	
	session: null,
	location: null,
	tracking: false,

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
        
        if(id == "loginsuccess") {
        
			console.log("Login was OK");
			$.mobile.changePage("../pages/tracking.html");
        
        }
        
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
      * Sign in an existing user
      * 
      **/
    signIn: function() {
    
		var username = "lars";
		var password = "test";
    
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
