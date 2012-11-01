var _ = require('underscore');
// var everyauth = require('everyauth');

load('application');

before(function() {
    this.user = req.user;

    next();
});

action('home', function () {
    Post.allWithFavorite({order: 'viewCount DESC'}, req.user, function(err, posts) {
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
    Post.allWithFavorite({order: 'created DESC'}, req.user, function(err, posts) {
        if (err != null) {
            console.log("Error querying posts: " + err);
        }
        render('home', {
            title: "TRAD NARA &raquo; Timeline",
            posts: posts
        });
    });
});

action('favorites', function() {
    if (!req.user) { return redirect('/login'); }

    req.user.lists(function(err, lists) {
        if (err || lists.length <= 0) {redirect('/');}
        var list = lists[0];
        
        list.getPosts(function(err, posts) {
            if (err) {return redirect('/');}

            _(posts).each(function(post) {post.isFavorited = true;});
            render('home', {
                title: "TRAD NARA &raquo; Favorites",
                posts: posts
            });
        });
    });
 });

action('login', function() {
	render({
		title: "TRAD NARA &raquo; Login",
	});
});