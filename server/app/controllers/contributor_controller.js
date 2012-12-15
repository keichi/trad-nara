load('application');

action('show', function () {
    layout(false);

    if (!req.user) {
    	send(403);
    	return;
    }
    render();
});