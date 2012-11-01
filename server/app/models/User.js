var async = require('async');

User.hasMany(FavoriteList, {as: 'lists', foreignKey: 'userListId'});

User.afterCreate = function(next) {
	this.lists.create(
		{name: 'Default list'},
		function(err) {
			next();
		}
	);
};

User.prototype.hasFavorited = function(post, callback) {
	this.lists(function(err, lists) {
		if (err) {return callback(err);}
		async.some(
			lists,
			function(list, cb) {
				list.existsPost(post, function(err, exists) {
					if (err) {return callback(err);}
					cb(exists);
				});
			},
			function(result) {
				callback(null, result);
			}
		);
	});
} ;