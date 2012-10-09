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
            if (data.topimage != undefined) {
               post.topimage = data.topimage.src;
            }

            post.save(function(err) {cb(null, post, isNew)});
        },
        function (post, isNew) {
            if (data.images != undefined && 'length' in data.images) {
                if (!isNew) {
                    post.images(function(err, images) {
                         _(images).each(function(image) {
                            image.destroy();
                        })
                    });
                }

                _(data.images).each(function(img, i) {
                    var image = post.images.build();
                    image.url = img.src;
                    image.order = i;
                    image.caption = img.caption;
                    image.save();
                });
            }
            send("successful");
        }
        ]);
});

action('delete', function () {
    Post.all(
        {where: {postId: req.body.id}},
        function(err, results) {
            if (results!= null) {
                _(results).each(function(result) {
                    result.images(function(err, images) {
                        _(images).each(function(img) {
                            img.destroy();
                        });
                    });
                    result.destroy();
                });
            }
        }
    );
    
    send("successful");
});

action('show', function () {
    layout(false);
    Post.find(req.params.id, function(err, post) {
        if (post == null) {
            redirect('/');
        } else {
            post.updateAttribute('viewCount', post.viewCount + 1, function() {});

            post.images(function(err, images) {
                post.imageurls = _(images).sortBy(function(img) {return img.order;});
                render({
                    title  :   'post#show',
                    post   :    post,
                    url    :    'http://' + req.headers.host + req.path
                });
            });
        }
    });
});
