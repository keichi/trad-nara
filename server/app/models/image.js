var async = require('async');

Image.belongsTo(Post, {as: 'post', foreignKey: 'postId'});

Image.changeToHttp = function(cb) {
	Image.all(function(err, images) {
		if (err) {cb(err);}

		async.forEach(
			images,
			function(image, c){
				image.url = image.url.replace(/^https(.*)/, 'http$1');
				image.save(c);
			},
			function(err) {
				cb(err);
			}
		);
	});
};