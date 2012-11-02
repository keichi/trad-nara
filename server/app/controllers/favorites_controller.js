load('application');

action('switch', function () {
	var backToOrigin = function() {
		if (req.query.origin) {
			redirect(req.query.origin);
		} else {
			redirect('/');
		}
	}
	if (req.user) {
	    req.user.lists(function(err, lists) {
	        if (err || lists.length <= 0) {backToOrigin();}
	        var list = lists[0];
	        
	        list.existsPost(req.params.id, function(err, exists) {
	        	if (err) {backToOrigin();}

	        	if (exists) {
			        list.removePost(req.params.id, function(err) {
			        	backToOrigin();
			        });
	        	} else {
			        list.addPost(req.params.id, function(err) {
			        	backToOrigin();
			        });
	        	}
	        });
	    });
	} else {
		backToOrigin();
	}
});