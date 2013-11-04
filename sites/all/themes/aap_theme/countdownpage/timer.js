(function($, window, undefined){
$.fn.countdown = function(opts) {
	var defaults = {
		callback	: function(){},
		timestamp	: 0,
		duration	: 360,
		soundURL	: false,
		volume: 100
	}

	// extend the options from defaults with user's options
	var options = $.extend(defaults, opts || {});
	 
	 
	// Number of seconds in every time division
	var days	= 24*60*60,
		hours	= 60*60,
		minutes	= 60;
	 
	var countWidth = 148;
	var countHeight = 136;
	var frames = 6;
	
	var xShift = countWidth/2;
	var yShift = countHeight*frames;
	
	var smZeroShift=10*yShift;
	var duration = parseInt(options.duration/6);
			
	var left, d, h, m, s;
	
	
	
	//Time in milliseconds
	var timems = options.timestamp['days']*24*60*60*1000+
				 options.timestamp['hours']*60*60*1000+
				 options.timestamp['minutes']*60*1000+
				 options.timestamp['seconds']*1000;
	
	
	
	var mySound;
	if(typeof(soundManager) != "undefined" && options.soundURL){
		
		soundManager.setup({
		onready: function() {
		mySound = soundManager.createSound({
						  id: 'aSound',
						  url: options.soundURL,
						  volume: options.volume
					  })
		  }
		});
		
	}
	
	
	function updateCount(elem,value,dPos){
			// dPos - digit position
			// 0 - days
			// 1 - hours
			// 2 - minutes and seconds
			

			var digit=elem.find('.digit');
			
			var l=parseInt(digit.eq(0).text());
			var r=parseInt(digit.eq(1).text());

			nextL=Math.floor(value/10)%10;
			nextR=value%10;

			if(digit.eq(0).text()==nextL && digit.eq(1).text()==nextR){
				return false;
			}
			
			var i=1;
			var yPosR=-(9-r)*frames*countHeight;
			var xPosL =(r>0)?(-2*xShift):0;
			var yPosL=-(9-l)*frames*countHeight;
			var wordTop = 0;
			
			if(l==0 && r==0){
					switch(dPos){
						case 2:{
							yPosL = -smZeroShift;
							break;}
						case 1:{
							yPosL = -smZeroShift;
							yPosR = -smZeroShift;
							xPosL =(-2*xShift);
							break;}
						case 0:{
						
							break;}
					}
				}

			setTimeout(function run() {
				
				if(i>2){
					wordTop =(i>=frames)?0:wordTop-countHeight;
					elem.find('.countWord').css({'top':wordTop})
				}
				
				if(r==0 && i==frames){
					yPosR = 0;
				} else{
					yPosR = yPosR-countHeight;
				}
				
				if(l==0 && i==frames && r==0){
					
					switch(dPos){
						case 2:{
							yPosL = -(9-5)*frames*countHeight;
						break;}
						case 1:{
							yPosL = -(9-2)*frames*countHeight;
							yPosR = -(9-3)*frames*countHeight;
						break;}
						case 0:{
						
						break;}
					}
				} else{
					if(i==(frames) && r>0) {
						yPosL = yPosL+(frames-1)*countHeight;
					}else{
						yPosL = yPosL-countHeight;
					}
				}	

				i++;
				digit.eq(1).css({'top':yPosR})
				digit.eq(0).css({'top':yPosL,'left':xPosL})
				if(i<=frames){
					setTimeout(run, duration);
				} else {
					if(typeof(soundManager) != "undefined" && options.soundURL){mySound.play();}
				}
			}, duration);
			digit.eq(0).text(nextL);
			digit.eq(1).text(nextR);
			
		}	
		
		function startPos(elem,dPos){
			// dPos - digit position
			// 0 - days
			// 1 - hours
			// 2 - minutes and seconds

			var digit=elem.find('.digit');
			
			var l=parseInt(digit.eq(0).text());
			var r=parseInt(digit.eq(1).text());
			
			
			digit.eq(1).css({'top':-yShift*(9-r),'left':-xShift});
				
			if(r>0){
				digit.eq(0).css({'top':-yShift*(9-l),'left':-2*xShift});
				
			} else{
				if(l>0){
					digit.eq(0).css({'top':-yShift*(9-l),'left':0});
				} else {
					switch(dPos){
						case 2  : {
							digit.eq(0).css({'top':-smZeroShift,'left':0});
							break;
						}
						case 1	: {
							digit.eq(0).css({'top':-smZeroShift,'left':-2*xShift});
							digit.eq(1).css({'top':-smZeroShift,'left':-xShift});
							break;
						}
						default	: {
							digit.eq(0).css({'top':-yShift*(9-l),'left':0});
						}
					}
				}
			}
		
		}
		
		function init(elem, options){
			elem.addClass('countdownHolder')
				.wrap('<div class="countdownWrap"></div>')
				.parent().append('<div class="countdownRight"></div>')
						.prepend('<div class="countdownLeft"></div>');

			// Creating the markup inside the container
			$.each(['days','hours','minutes','seconds'],function(i){
				
				$('<span class="count-'+this+'"></span>').html(
					'<span class="position count-l">\
						<div class="countWord"></div>\
						<span class="digit">'+Math.floor(options.timestamp[this]/10)%10+'</span>\
					</span>\
					<span class="position count-r">\
						<div class="countWord"></div>\
						<span class="digit">'+options.timestamp[this]%10+'</span>\
					</span>'
				).appendTo(elem);
				
				
			});

		}
	return this.each(function(){ 
		// Initialize the plugin
		init($(this), options);
		
		var ts = (new Date()).getTime() + timems;
		var countS=$(this).find('.count-seconds');
		var countM=$(this).find('.count-minutes');
		var countH=$(this).find('.count-hours');
		var countD=$(this).find('.count-days');
		
		var word=$(this).find('.countWord').each(function(i){
				$(this).css({'left':-i*xShift})
			})
			
		startPos(countS,2);
		startPos(countM,2);
		startPos(countH,1);
		startPos(countD,0);	
		
		(function tick(){
			
			// Time left
			left = Math.floor((ts - (new Date())) / 1000);
			
			if(left < 0){
				left = 0;
			}
			// Number of days left
			d = Math.floor(left / days);
			left -= d*days;
			updateCount(countD,d,0)
			// Number of hours left
			h = Math.floor(left / hours);
			left -= h*hours;
			updateCount(countH,h,1)
			
			
			// Number of minutes left
			m = Math.floor(left / minutes);
			updateCount(countM,m,2)
			left -= m*minutes;
			
			// Number of seconds left
			s = left;
			updateCount(countS,s,2)

			// Calling an optional user supplied callback
			options.callback(d, h, m, s);
			
			// Scheduling another call of this function in 1s
			setTimeout(tick, 1000);
		})();
	});
}
})(jQuery, window);





  	

	