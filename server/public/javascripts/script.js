$(document).ready(function() {    
    var $container = $('#container');
    var $box = $('.post-box');
    var w = $box.width();
    var h = $box.height();
    var m = 15;
    var s = 500;
    var initWidth = $container.width();
    var initHeight = $container.height();
    var spinner;

    $('.post-box img').contenthover({
        overlay_background  :   '#000',
        overlay_opacity     :   0.8,
    });

    $('.top-scroll').click(function() {
        $(this).blur();
        $('html,body').animate({ scrollTop: 0 }, 'slow');

        return false;
    });

    $('.meta-favorite').powerTip();
    $('.meta-view').powerTip();
    $('.meta-like').powerTip();
    $('.meta-comments').powerTip();
    $('#navigation li a').powerTip();

    $('.meta-favorite').click(function() {
        var star = $(this).children('i');
        var postId = $(this).parents('.post-box').attr('id').replace('post-', '');

        $.ajax({
            url: '/favorites/switch',
            data: {
                id: postId 
            },
            dataType: 'json',
            success: function( data, textStatus, jqXHR ) {
                if (data.error) {
                    alert('Failed to register to favorites!');
                } else {
                    star.toggleClass('icon-star-empty');
                    star.toggleClass('icon-star');
                }
            }
        });

        return false;
    });

    function init() {
        $container.addClass('jsReady');
        $box.css({
            'left'  :   initWidth / 2 - w / 2,
            'top'   :   initHeight / 2 ,
        });
        $box.hover(function() {
            $(this).animate({boxShadow: '0 0 20px #000'}, 300);
        }, function() {
            $(this).animate({boxShadow: '0 1px 4px #000'}, 300);
      });

    var opts = {
        lines: 13, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#fff', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto', // Left position relative to parent in px
      };
      $('#container').prepend('<div id="loading"></div>');
      spinner = new Spinner(opts).spin($('#loading')[0]);
  }

  function layout(e) {
        // $box.css('display', 'inline-block');
        spinner.stop();

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
            .fadeIn()
            .animate({
                'left': Math.round((i % cols) * (w + _m)) + _m,
                'top': Math.floor(i / cols) * (h + _m)
        }, s + i * 30, 'easeOutBounce');
    });

        initWidth = undefined;
    }

    if ($('#loginlinks').length == 0) {
      	// イベントの登録
      	$(window).bind('load resize', layout);

        init();
    }
});