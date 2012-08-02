$(document).ready(function() {    
    var $container = $('#container');
    var $box = $('.post-box');
    var w = $box.width();
    var h = $box.height();
    var m = 15;
    var s = 500;
    var initWidth = $container.width();
    var initHeight = $container.height();
    
	$('.post-box img').contenthover({
        overlay_background  :   '#000',
        overlay_opacity     :   0.8,
/*
        effect              :   'slide',
        slide_direction     :   'top',
        slide_speed         :   300,
*/
    });
    
    $('#navigation ul li a').hover(function() {
		$(this).stop().animate({ backgroundColor: "#555" }, 400);
		$('#navigation').stop().animate({
		  'border-top-color'  :   "#fff",
		  'border-bottom-color' : "#fff"
		  }, 400);
	},function() {
		$(this).stop().animate({ backgroundColor: "#000" }, 800);
		$('#navigation').stop().animate({
		  'border-top-color'  :   "#aaa",
		  'border-bottom-color' : "#aaa"
		  }, 400);
	});
	
	$('.top-scroll').click(function() {
        $(this).blur();
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        
        return false;
	});
    
    function init() {
        $container.addClass('jsReady');
        if($box.size()>0){
            $box.css({
                'left'  :   0,
                'top'   :   0,
            });
        }else{
            $('#navigation').show(200);
            $('#footer').show(200);
            $('#header').show(200);
        }
    }
    
	function layout(e) {
    	var cw = initWidth || $container.width();
		var cols = Math.floor((cw + m) / (w + m));
		var rows = Math.ceil( $box.size() / cols );
		var _m = Math.floor((cw - cols * w) / (cols + 1));
		
		$container.css({
		  'height'    :   rows * (h + _m) - _m
		  });
		
		$box.each(function(i){
            $(this)
				.stop(true)
				.animate({
						'left': Math.round((i % cols) * (w + _m)) + _m,
						'top': Math.floor(i / cols) * (h + _m)
					}, s + i * 30, 'easeInOutExpo', function() {
    					if (e.type == "load") {
        					$('#navigation').show(200);
        					$('#footer').show(200);
        					$('#header').show(200);
    					}
					});
		});
		
		initWidth = undefined;
	}
	
	// イベントの登録
	$(window).bind('load resize', layout);
    
    init();
});