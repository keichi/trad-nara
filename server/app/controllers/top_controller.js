load('application');

before(function() {
	this.user = req.session.user;
	next();
});

action('home', function () {
    Post.all(function(err, posts) {
        if (err != null) {
            console.log("Error querying posts: " + err);
        }
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