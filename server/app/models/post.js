var _ = require('underscore');
var async = require('async');

Post.hasMany(Image, {as: 'images', foreignKey: 'postId'});
Post.hasMany(FavoriteRelation, {as: 'favoriteRelations', foreignKey: 'postRelationId'});

Post.beforeDestroy = function(next) {
	this.images(function(err, images) {
		_(images).each(function(img) {
			img.destroy();
		});

		next();
	});
};

Post.allWithFavorite = function(cond, user, cb) {
	var isLoggedIn = user != null;

	Post.all(cond, function(err, posts) {
	 if (err) {return cb(err);}

	 if (!isLoggedIn) {
	 	_(posts).map(function(post) {
	 		post.isFavorited = false;
	 	});
	 	return cb(null, posts);
	 }

	 async.map(
		 posts,
		 function(post, cb) {
			 user.hasFavorited(post, function(err, isFavorited) {
				 post.isFavorited = isFavorited;
				 cb(err, post);
			 });
		 },
		 function(err, results) {
			 cb(err, results);
		 }
	 );
	});
};