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
            title: "TRAD NARA &raquo; Home",
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
            title: "TRAD NARA &raquo; Timeline",
            posts: posts
        });
    });
});

action('login', function() {
	render({
		title: "TRAD NARA &raquo; Login",
	});
});