exports.routes = function (map) {
    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.root('top#home');
    map.get('/timeline', 'top#timeline');
    map.get('/favorites', 'top#favorites');

    map.get('/login', 'top#login');
    map.get('/post/:id', 'post#show');

    // Internal routes
    map.post('/internal/post/create', 'post#create');
    map.post('/internal/post/delete', 'post#delete');
};
