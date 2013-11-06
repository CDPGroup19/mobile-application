var MapHelper = function() {

	this._running = false;
	
	this.map = null;
	
	//sets default position to Trondheim
	this.center = new google.maps.LatLng(63,4305, 10,3951);
	
	this.marker = new google.maps.Marker ({ 
		animation: google.maps.Animation.DROP,
		position: this.center
	});
	
	this.line = new google.maps.Polyline({ 
		path: [],
		strokeColor: "#ff0000",
		strokeOpacity: 1.0,
		strokeWeight: 3,
		editable: !true,
		draggable: !true
	});
	
	this.lineCoords = this.line.getPath();
	
	var update = function(position) {
		
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		
		var latlng = new google.maps.LatLng(lat, lng);
		
		// Push coordiante to path
		
		this.lineCoords.push(latlng);
		
		// Update map center
		
		this.map.setCenter(latlng);
		this.marker.setPosition(latlng);
		
	};
	
	var create = function() {
	
		console.warn("Creation called");
		
		var $content = $("#map");
		
		$content.height (screen.height - 110);
		
		this.map = new google.maps.Map($content[0], { 
			zoom: 15, 
			center: this.center, 
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
		this.line.setMap(this.map);
		this.marker.setMap(this.map);
		
		this._running = true;
		
	};
	
	var init = function() {
		
		//$(document).bind("pageinit", (function() {
		//	if(app.isTracking) {
		//		this.create();
		//	} else {
		//		$("#start").click(this.create);
		//	}
		//}).bind(this));
	
	};

	this.update = update.bind(this);
	this.init = init.bind(this);
	this.create = create.bind(this);

};