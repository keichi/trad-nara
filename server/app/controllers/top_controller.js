var _ = require('underscore');
// var everyauth = require('everyauth');

load('application');

before(function() {
    // console.log(everyauth);
    this.isLoggedIn = req.loggedIn;
    if (this.isLoggedIn) {
        this.user = req.user.name;
    }

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
        render('home', {
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