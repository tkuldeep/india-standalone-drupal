(function ($, Drupal, window, document, undefined) {
	Drupal.behaviors.make_header_sticky = {
			attach: function(context) { 
				var header_menu = $('.main-menu-row');

				 $(window).scroll(function(){
					
					var edge = $(window).scrollTop();
					var os_header_menu = header_menu.offset().top;

					if (os_header_menu <= edge) {
       						header_menu.addClass("sticky-header");
   					}
					if (edge == 0) {
						header_menu.removeClass("sticky-header");					
					}
				});
				
			}
	}	
}
)(jQuery, Drupal, this, this.document); 
