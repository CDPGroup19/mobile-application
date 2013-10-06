$( document ).bind( "pageinit", function( event, data ) {
    var menuStatus;
    var menu = $("#menu");
	menu.hide();
	
    $("a.showMenu").click(function(){
        if(menuStatus != true){  
		menu.show();           
        $(".ui-page-active").animate({
            marginLeft: "165px",
          }, 300, function(){menuStatus = true});
          return false;
          } else {
			menu.hide();
            $(".ui-page-active").animate({
            marginLeft: "0px",
          }, 300, function(){menuStatus = false});
            return false;
          }
    });
 
    $('.pages').live("swipeleft", function(){
        if (menuStatus){    
        $(".ui-page-active").animate({
            marginLeft: "0px",
          }, 300, function(){menuStatus = false});
			menu.hide();
          }
    });
     
    $('.pages').live("swiperight", function(){
        if (!menuStatus){   
        $(".ui-page-active").animate({
            marginLeft: "165px",
          }, 300, function(){menuStatus = true});
		
          }
    });
     
    $("#menu a").click(function(){
		
        var p = $(this).parent();
        if($(p).hasClass('active')){
            $("#menu a").removeClass('active');
        } else {
            $("#menu a").removeClass('active');
            $(p).addClass('active');
          
        }
		
    });
         
});