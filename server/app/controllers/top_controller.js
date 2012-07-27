load('application');

action('home', function () {
    layout(false);
    
    Post.all(function(err, posts) {
        render({
            title: "top#home",
            posts: posts,
        });
    });
});
