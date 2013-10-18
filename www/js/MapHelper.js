var MapHelper = function() {

	this.lineCoords = [];
	this.map = null;
	
	this.marker = null;
	this.line = null;
	
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
		
		var center = new google.maps.LatLng(63.4122, 10.4388);
		
		var options = { 
			zoom: 15, 
			center: center, 
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP 
		};
		
		var $content = $("#map");
		
		$content.height (screen.height - 110);
		
		this.map = new google.maps.Map($content[0], options);
		
		console.warn("asdsaasdsad", this, this.map);
		
		$.mobile.changePage ($("#tracking"));
		
		var lineCoords = [];
		
		this.marker = new google.maps.Marker ({ 
			map: this.map, 
			animation: google.maps.Animation.DROP,
			position: center
		});
		
		this.line = new google.maps.Polyline({ 
			path: lineCoords,
			strokeColor: "#ff0000",
			strokeOpacity: 1.0,
			strokeWeight: 3,
			editable: !true,
			draggable: !true
		});
		
		this.lineCoords = this.line.getPath();
		
		this.line.setMap(this.map);
		
	};
	
	var init = function() {
		
		$(document).bind("pageinit", (function() {
			$("#start").click(this.create);
		}).bind(this));
	
	};

	this.update = update.bind(this);
	this.init = init.bind(this);
	this.create = create.bind(this);

};