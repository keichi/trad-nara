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
    
    // Googleマップの埋め込み
	var gmap = $("#gmap").gmap3({
		address: $('#gmap .address').text(),
		zoom: 15,              // ズームレベル
		
		// 各コントロールの表示／非表示
		navigationControl: true,
		mapTypeControl: false,
		scaleControl: true,
		
		// マーカーの設置
		markers: [
			{
        		address:  $('#gmap .address').text(),
                title: $('#gmap .name').text(),
                content: '<div class="location-name">{0}</div><div class="location-address">{1}</div><div class="location-gmap">\
                    <a href="https://maps.google.com/maps?q={2}">Open in Google Maps</a></div>'.format(
                     $('#gmap .name').text(),
                     $('#gmap .address').text(),
                    $('#gmap .address').text()),
                openInfo: true
			}
		]
	
	}).data('gmap');
	
	// カスタムマップタイプを設定
	var myStyledMapType = new google.maps.StyledMapType(
		[
			{
				featureType: "all",
				elementType: "all",
				stylers: [
					{ hue: '#1f8dc2' },
					{ lightness: 10 },
					{ saturation: 10 },
					{ gamma: .9 }
				]
			}
		]
	);
	
	// カスタムマップタイプの登録
	// gmap.mapTypes.set('myMapType', myStyledMapType);
	// gmap.setMapTypeId('myMapType');
});