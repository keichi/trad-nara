load('application');

var _ = require('underscore');
var async = require('async');

function createSlug(title) {
    title = title.toLowerCase();
    title = title.replace(/[^a-zA-Z0-9\s-]/g, '');
    title = title.replace(/\s+/g, ' ');
    title = title.replace(/\s/g, '-');
    return title;
}

action('create', function () {
    var data = req.body;

    async.waterfall([
        function(cb) {
            Post.all({where: {wpPostId: data.id}}, cb);
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

            post.wpPostId = parseInt(data.id);
            post.author = data.author;
            post.title = data.title;
            post.lead = data.lead;
            post.body = data.body;
            post.address = data.address;
            post.label = data.label;
            post.modified = new Date(data.modified);
            post.created = new Date(data.created);
            post.category = data.category;
            post.slug = createSlug(post.title);

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
        {where: {wpPostId: req.body.id}},
        function(err, results) {
            _(results).each(function(result) {
                result.destroy();
            });
        }
    );
    
    send("successful");
});

action('show', function () {
    layout('application');

    Post.findOne({where: {slug: req.params.slug}}, function(err, post) {
        if (post == null) {
            redirect('/');
        } else {
            post.updateAttribute('viewCount', post.viewCount + 1, function() {});

            post.images(function(err, images) {
                post.imageurls = _(images).sortBy(function(img) {return img.order;});
                render({
                    title  :    post.title,
                    post   :    post,
                    url    :    'http://' + req.headers.host + req.path
                });
            });
        }
    });
});
