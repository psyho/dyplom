jQuery(document).ready(function() {
	jQuery(".flickrTag_container img.flickr").each(function(i) {
		var e = jQuery(this);

		if(e.attr("title") != "") {
			var b = jQuery("body");

			// assign an id to the image if it doesn't have one already
			if(! this.id)
				this.id = Math.ceil(Math.random() * 100000000);

			b.append("<div class='flickrTag_tooltip' id='tooltip_" + this.id + "'><p class='text'>" + e.attr("title") + "</p></div>");

			var n = jQuery("#tooltip_" + this.id);

			n.hide();
		}
	});

	jQuery(".flickrTag_container img.flickr").mouseover(function(event) {
		event.preventDefault();

		// we move the bubble now because we can't be sure the images have loaded until now (and thus their dimensions are unknown)
		var e = jQuery(this);
		var n = jQuery("#tooltip_" + this.id);

		n.css("left", e.offset().left + e.scrollLeft());
		n.css("top", e.offset().top + e.height() + e.scrollTop());
		n.show();
	});

	jQuery(".flickrTag_container img.flickr").mouseout(function(event) {
	   	event.preventDefault();

		jQuery("#tooltip_" + this.id).hide();
	});
});
