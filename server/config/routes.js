exports.routes = function (map) {

    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.root('top#home');
    map.post('/internal/post/create', 'post#create');
    map.post('/internal/post/delete', 'post#delete');
    map.get('/internal/post/show', 'post#show');
};
