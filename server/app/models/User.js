User.hasMany(FavoriteList, {as: 'lists', foreignKey: 'userListId'});

User.afterCreate = function(next) {
	this.lists.create(
		{name: 'Default list'},
		function(err) {
			next();
		}
	);
};