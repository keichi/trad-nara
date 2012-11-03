load('application');

action('switch', function () {
	if (req.user) {
	    req.user.lists(function(err, lists) {
	        if (err || lists.length <= 0) {
	        	return send(JSON.stringify({error: true}));
	        }
	        var list = lists[0];
	        
	        list.existsPost(req.query.id, function(err, exists) {
	        	if (err) { return send(JSON.stringify({error: true})); }

	        	if (exists) {
			        list.removePost(req.query.id, function(err) {
			        	return send(JSON.stringify({error: false}));
			        });
	        	} else {
			        list.addPost(req.query.id, function(err) {
			        	return send(JSON.stringify({error: false}));
			        });
	        	}
	        });
	    });
	} else {
		return send(JSON.stringify({error: true}));
	}
});