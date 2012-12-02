var _ = require('underscore');

load('application');

action('home', function () {
    Post.allWithFavorite({order: 'viewCount DESC'}, req.user, function(err, posts) {
        if (err != null) {
            console.log("Error querying posts: " + err);
        }
        render({
            title: "Home",
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
            title: "Timeline",
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
                title: "Favorites",
                posts: posts
            });
        });
    });
 });

action('login', function() {
	render({
		title: "Login",
	});
});

action('contributors', function() {
    render({
        title: "Contributors",
    });
});

action('privacyPolicy', function() {
    render({
        title: "Privacy Policy",
    });
});