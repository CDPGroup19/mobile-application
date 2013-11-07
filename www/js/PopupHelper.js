var PopupHelper = function() {

	

	this.add = function(id, type, category, title, message, button_text, handlers) {

		id = id || ("popup" + parseInt(Math.random() * 999));
		
		button_text = !(button_text instanceof Array) ? [button_text] : button_text;
		handlers = !(handlers instanceof Array) ? [handlers] : handlers;
		
		var button_ok = "<a id=\"" + id + "_ok\" href=\"#\" data-role=\"button\" data-inline=\"true\" data-rel=\"back\" data-transition=\"flow\" data-theme=\"a\">" + button_text[0] + "</a>";
		var button_cancel = "";
		
		if(type > 0) {
			button_cancel = "<a id=\"" + id + "_cancel\"href=\"#\" data-role=\"button\" data-inline=\"true\" data-rel=\"back\" data-transition=\"flow\" data-theme=\"a\">" + button_text[1] + "</a>";;
		}

		$.mobile.activePage.append("\
			<div data-role=\"popup\" id=\"" + id + "\" class=\"popupDialog\" data-overlay-theme=\"a\" data-theme=\"c\" style=\"min-width: 200px; max-width:400px;\" class=\"ui-corner-all\" data-position-to=\"window\"> \
				<div data-role=\"header\" data-theme=\"a\" class=\"ui-corner-top\">\
					<h1>" + category + "</h1>\
				</div>\
				<div style=\"padding: 10px;\" data-role=\"content\" data-theme=\"d\" class=\"ui-corner-bottom ui-content\">\
					<h3 class=\"ui-title\">" + title + "</h3>\
					<p>" + message + "</p>\
					<div id=\"dialogButtons\">    \
						" + button_ok + "\
						" + button_cancel + "\
					</div> \
				</div>\
			</div>"
		);
		
		$('#' + id + "_ok").click(handlers[0]);
		
		if(type > 0) {
			$('#' + id + "_cancel").click(handlers[1]);
		}
		
		$('#' + id).popup();
		$('#' + id).popup("open");

		$.mobile.activePage.page('destroy').page()
	};
	
	this.warn = function(message) {
	
		this.add(
			undefined,
			0,
			"Warning",
			"Something went wrong...",
			message,
			"OK",
			(function() { void 0; })
		);
	
	};


	
};