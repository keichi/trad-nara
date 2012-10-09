var _ = require('underscore');

load('application');

before(function() {
	this.user = req.session.user;
	next();
});

action('home', function () {
    Post.all({order: 'viewCount DESC'}, function(err, posts) {
        if (err != null) {
            console.log("Error querying posts: " + err);
        }
        render({
            title: "top#home",
            posts: posts
        });
    });
});

action('timeline', function () {
    Post.all({order: 'created DESC'}, function(err, posts) {
        if (err != null) {
            console.log("Error querying posts: " + err);
        }
        render({
            title: "top#timeline",
            posts: posts
        });
    });
});

action('login', function() {
	render({
		title: "Login",
	});
});