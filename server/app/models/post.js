var _ = require('underscore');

Post.beforeDestroy = function(next) {
	this.images(function(err, images) {
		_(images).each(function(img) {
			img.destroy();
		});

		next();
	});
}