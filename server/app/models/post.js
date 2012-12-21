module.exports = function(compound, Post) {

var _ = require('underscore');
var async = require('async');

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

Post.updateSlug = function(cb) {
	function createSlug(title) {
	    title = title.toLowerCase();
	    title = title.replace(/[^a-zA-Z0-9\s-]/g, '');
	    title = title.replace(/\s+/g, ' ');
	    title = title.replace(/\s/g, '-');
	    return title;
	}

	Post.all(function(err, posts) {
		if (err) {return cb(err);}
		
		async.forEach(
			posts,
			function(post, cb) {
				post.slug = createSlug(post.title);
				post.save(cb);
			},
			function(err) {
				cb(err);
			}
		);
	});
};

};