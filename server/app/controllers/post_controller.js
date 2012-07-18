load('application');

action('create', function () {
    var post = new Post();
    var data = req.body;
    
    post.id = Math.floor(Math.random() * 100000); //data.id;
    post.author = data.author;
    post.title = data.title;
    post.date = data.date;
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

    send(data);
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
