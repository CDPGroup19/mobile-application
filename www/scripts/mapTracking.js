
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
	});

});