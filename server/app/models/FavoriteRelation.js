FavoriteRelation.belongsTo(FavoriteList, {as: 'list', foreignKey: 'listRelationId'});
FavoriteRelation.belongsTo(Post, {as: 'post', foreignKey: 'postRelationId'});
