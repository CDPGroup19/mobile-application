var MapHelper = function() {

	this.lineCoords = [];
	this.map = null;
	
	var update = function(position) {
		
		return;
		
		console.log(this);
		
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		
		var latlng = new google.maps.LatLng(lat, lng);
		
		// Push coordiante to path
		
		this.lineCoords.push(latlng);
		
		// Update map center
		
		this.map.center = latlng;
		
	};
	
	var create = function() {
	
		console.warn("Creation called");
		
		var center = new google.maps.LatLng(63.4122, 10.4388);
		
		var options = { 
			zoom: 15, 
			center: center, 
			mapTypeId: google.maps.MapTypeId.ROADMAP 
		};
		
		var $content = $("#map");
		
		$content.height (screen.height - 50);
		
		this.map = new google.maps.Map($content[0], options);
		
		console.warn("asdsaasdsad", this.map);
		
		$.mobile.changePage ($("#tracking"));
		
		this.lineCoords = [];
		
		var line = new google.maps.Polyline({ 
			path: this.lineCoords,
			strokeColor: "#ff0000",
			strokeOpacity: 1.0,
			strokeWeight: 5,
			editable: true
		});
		
		line.setMap(this.map);
		
	};
	
	var init = function() {
		
		$(document).bind("pageinit", function() {
			$("#start").click(create);
		});
	
	};

	this.update = update.bind(this);
	this.init = init.bind(this);
	this.create = create.bind(this);

};