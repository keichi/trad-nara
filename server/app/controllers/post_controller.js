load('application');

require('underscore');
var async = require('async');

action('create', function () {
    var data = req.body;

    async.waterfall([
        function(cb) {
            Post.all(
                {where: {post_id: data.id}},
                function(err, results) {cb(null, results);}
                );
        },
        function(results) {
            var post = results.length > 0 ? results[0] : new Post();

            post.post_id = data.id;
            post.author = data.author;
            post.title = data.title;
            post.lead = data.lead;
            post.body = data.body;
            post.address = data.address;
            post.label = data.label;
            post.modified = new Date(data.modified);
            post.created = new Date(data.created);
            if (data.images instanceof Array) {
                _.each(data.images, function(url) {
                    var image = post.images.build();
                    image.url = url;
                    image.post(post);
                    image.save();
                });
            }
            post.save();

            send("successful");
        }
        ]);
});

action('delete', function () {
    render({
        title   :   'post#delete'
    });
});

action('show', function () {
    Post.all(function(err, posts) {
        render({
            title   :   'post#show',
            posts   :   posts 
        });
    });
});
