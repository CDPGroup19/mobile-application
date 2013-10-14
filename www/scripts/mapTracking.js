
/*
navigator.geolocation.getCurrentPosition (function (pos)
{
  var lat = pos.coords.latitude;
  var lng = pos.coords.longitude;
  $("#lat").val (lat);
  $("#lng").val (lng);
});
*/
$(document).bind("pageinit", function(event, data){

	$("#start").click(function(){
	  /*var lat = $("#lat").val ();
	  var lng = $("#lng").val ();*/
	  var latlng = new google.maps.LatLng (63.4122938, 10.4388454);
	  var options = { 
		zoom : 15, 
		center : latlng, 
		mapTypeId : google.maps.MapTypeId.ROADMAP 
	  };
	  var $content = $("#map");
	  $content.height (screen.height - 50);
	  var map = new google.maps.Map ($content[0], options);
	  $.mobile.changePage ($("#tracking"));
	  
	  new google.maps.Marker ( 
	  { 
		map : map, 
		animation : google.maps.Animation.DROP,
		position : latlng  
	  });  
	  
	  
	  
	  var polylineCoordinates = [
			new google.maps.LatLng(63.430552000000006,10.4198838),
			new google.maps.LatLng(63.4305551,10.4198696),
			new google.maps.LatLng(63.430540900000004,10.4198515),
			new google.maps.LatLng(63.43057169999999,10.4198963),
			new google.maps.LatLng(63.4305435,10.4198916),
			new google.maps.LatLng(63.4305541,10.4199129),
			new google.maps.LatLng(63.430553800000006,10.4198997),
			new google.maps.LatLng(63.43054599999999,10.4199348),
			new google.maps.LatLng(63.4305463,10.419937299999999),
			];
		
		var polyline = new google.maps.Polyline({
			path: polylineCoordinates,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 5,
			editable: true
		});

  		polyline.setMap(map);   
	});

});