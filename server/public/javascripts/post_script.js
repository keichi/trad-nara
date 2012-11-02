(function() {
    if (String.prototype.format == undefined) {
        String.prototype.format = function(arg) {
            var args = arguments;
            return this.replace( /\{(\d+)\}/g, function(m, k) { return args[ parseInt(k) ]; } );
        }
    }
})();

$(document).ready(function() {
    $('.flexslider').flexslider();
    
    $('#sidebar ul li.widget-container img').wrap('<div class="ad-image"></div>');
    $('.ad-image').css('background-color', 'white');
    $('.ad-image').css('margin', '5px 0');
    
    $('#sidebar ul li.widget-container img').mouseover(function() {
        $(this).fadeTo(150, 0.6);
    });
    $('#sidebar ul li.widget-container img').mouseout(function() {
        $(this).fadeTo(150, 1.0);
    });
    
    $('.post a').powerTip();
    
    // Googleマップの埋め込み
	var gmg = new google.maps.Geocoder(), map, center, mk, iw;
    gmg.geocode({
		'address': $('#mapinfo .address').text()
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			center = results[0].geometry.location;
			initialize();
			iw = new google.maps.InfoWindow({
                    content: '<div class="location-name">{0}</div><div class="location-address">{1}</div><div class="location-gmap">\
                    <a href="https://maps.google.com/maps?q={2}">Open in Google Maps</a></div>'.format(
                     $('#mapinfo .name').text(),
                     $('#mapinfo .address').text(),
                    $('#mapinfo .address').text())
            });
            mk = new google.maps.Marker({//ここからマーカーの設定
            	map: map,
            	position: results[0].geometry.location,
                title: $('#mapinfo .name').text()
            });
            iw.open(map, mk);
            google.maps.event.addListener(mk, 'click', function() {
			    iw.open(map,mk);
			});
		}
	});

	function initialize() {
		var options = {
			center: center,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
			panControlOptions: {
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			zoomControlOptions: {
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			mapTypeControlOptions: {
				position: google.maps.ControlPosition.BOTTOM_LEFT
			},
			styles: [{
				stylers: [
				{ hue: "#ef454a" },
				{ gamma: 1.90 },
				{ saturation: 80 }
				]
			}]
		};
		map = new google.maps.Map($("#gmap").get(0), options);
	}
});