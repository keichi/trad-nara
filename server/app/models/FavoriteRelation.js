module.exports = function(compound, FavoriteRelation) {
	var FavoriteList = compound.models.FavoriteList;
	var Post = compound.models.Post;
	FavoriteRelation.belongsTo(FavoriteList, {as: 'list', foreignKey: 'listRelationId'});
	FavoriteRelation.belongsTo(Post, {as: 'post', foreignKey: 'postRelationId'});
};