module.exports = function(compound, FavoriteList) {

var async = require('async');
var _ = require('underscore');

FavoriteList.prototype.getPosts = function(callback) {
	this.favoriteRelations(function(err, relations) {
		if (err) { return callback(err); }
		async.map(relations, function(relation, cb) {
			relation.post(function(err, post) {
				cb(err, post);
			});
			// TODO postが取得できななかった場合の処理を追記すべき
		}, function(err, results) {
			callback(err, _(results).filter(function(post) {return post}));
		});
	});
};

FavoriteList.prototype.addPost = function(post, callback) {
	var relation = new FavoriteRelation();
	var postId = typeof post == 'object' && 'id' in post ? post.id : post;
	var listId = this.id;

	relation.list(listId);
	relation.post(postId);

	relation.save(function(err) {
		callback(err);
	});
};

FavoriteList.prototype.removePost = function(post, callback) {
	var postId = typeof post == 'object' && 'id' in post ? post.id : post;

	FavoriteRelation.all(
		{where: {listRelationId: this.id, postRelationId: postId}},
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
	var postId = typeof post == 'object' && 'id' in post ? post.id : post;

	FavoriteRelation.findOne(
		{where: {listRelationId: this.id, postRelationId: postId}},
		function(err, relation) {
			if (err) {return callback(err);}
			callback(null, relation ? true : false);
		}
	);
}

};