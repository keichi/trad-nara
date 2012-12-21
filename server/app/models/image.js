module.exports = function(compound, Image) {

var async = require('async');

var Post = compound.models.Post;
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

};