
$( document ).bind( "pageinit", function( event, data ) {
	var startButton = $("#start");
	var stopButton = $("#stop");
	
	stopButton.hide();

	startButton.click(function(){
		stopButton.show();
        startButton.hide();
	});
	
	
	stopButton.click(function(){
		startButton.show();
       	stopButton.hide();
	});
});
