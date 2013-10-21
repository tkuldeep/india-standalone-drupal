(function ($, Drupal, window, document, undefined) {
	Drupal.behaviors.make_header_sticky = {
			attach: function(context) { 
				var countdown = $('.aap-countdown-class');

				 $(window).scroll(function(){
					
					var edge = $(window).scrollTop();
					var os_countdown = countdown.offset().top;

					if (os_countdown <= edge) {
       						countdown.addClass("sticky-header");
   					}
					if (edge == 0) {
						countdown.removeClass("sticky-header");					
					}
				});
				
			}
	}	
}
)(jQuery, Drupal, this, this.document); 
