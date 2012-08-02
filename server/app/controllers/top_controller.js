load('application');

before(function() {
	this.user = req.session.user;
	next();
});

action('home', function () {
    Post.all(function(err, posts) {
        render({
            title: "top#home",
            posts: posts
        });
    });
});

action('login', function() {
	render({
		title: "Login",
	});
});