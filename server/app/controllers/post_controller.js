load('application');

var _ = require('underscore');
var async = require('async');

action('create', function () {
    var data = req.body;

    async.waterfall([
        function(cb) {
            Post.all(
                {where: {postId: data.id}},
                function(err, results) {cb(null, results);}
                );
        },
        function(results, cb) {
            var isNew = false;
            var post;
            if (results.length > 0) {
                post = results[0];
            } else {
                post = new Post();
                isNew = true;
            }

            post.postId = data.id;
            post.author = data.author;
            post.title = data.title;
            post.lead = data.lead;
            post.body = data.body;
            post.address = data.address;
            post.label = data.label;
            post.modified = new Date(data.modified);
            post.created = new Date(data.created);
            post.topimage = data.topimage.src;

            post.save(function(err) {cb(null, post, isNew)});
        },
        function (post, isNew) {
            if ('length' in data.images) {
                if (!isNew) {
                    post.images(function(err, images) {
                         _(images).each(function(image) {
                            image.destroy();
                        })
                    });
                }

                _(data.images).each(function(img) {
                    var image = post.images.build();
                    image.url = img.src;
                    image.save();
                });
            }
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
    layout(false);
    Post.find(req.params.id, function(err, post) {
        post.images(function(err, images) {
            post.imageurls = images;
            render({
                title  :   'post#show',
                post   :    post,
                url    :    'http://' + req.headers.host + req.path
            });
    });
    });
});
