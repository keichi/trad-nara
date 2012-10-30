var _ = require('underscore');

Post.hasMany(Image, {as: 'images', foreignKey: 'postId'});
Post.hasMany(FavoriteRelation, {as: 'favoriteRelations', foreignKey: 'postRelationId'});

Post.beforeDestroy = function(next) {
	this.images(function(err, images) {
		_(images).each(function(img) {
			img.destroy();
		});

		next();
	});
}
