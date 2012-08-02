load('application');

action('home', function () {
    Post.all(function(err, posts) {
        render({
            title: "top#home",
            posts: posts,
            userName: req.session.user ? req.session.user.name : "Anonymous"
        });
    });
});

action('login', function() {
	render({
		title: "Login",
	});
});