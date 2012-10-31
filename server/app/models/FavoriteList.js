var async = require('async');

FavoriteList.belongsTo(User, {as: 'user', foreignKey: 'userListId'});
FavoriteList.hasMany(FavoriteRelation, {as: 'favoriteRelations', foreignKey: 'listRelationId'});

FavoriteList.prototype.getPosts = function(callback) {
	this.favoriteRelations(function(err, relations) {
		if (err) { return callback(err); }
		async.map(relations, function(relation, cb) {
			relation.post(function(err, post) {
				cb(err, post);
			});
		}, function(err, results) {
			callback(err, results);
		});
	});
};

FavoriteList.prototype.addPost = function(post, callback) {
	var relation = new FavoriteRelation();
	relation.list(this);
	relation.post(post);

	relation.save(function(err) {
		callback(err);
	});
};

FavoriteList.prototype.removePost = function(post, callback) {
	FavoriteRelation.all(
		{where: {listRelationId: this.id, postRelationId: post.id}},
		function(err, relations) {
			if (err) { return callback(err); }
			async.forEach(
				relations,
				function(relation, cb) {
					relation.destroy(cb);
				},
				function(err) {
					callback(err);
				}
			);
		}
	);
};

FavoriteList.prototype.existsPost = function(post, callback) {
	FavoriteRelation.count(
		{where: {listRelationId: this.id, postRelationId: post.id}},
		function(err, count) {
			if (err) {return callback(err);}
			callback(null, count > 0);
		}
	);
}