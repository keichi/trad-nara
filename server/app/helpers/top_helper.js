module.exports = {
    ribbon_color : function(s) {
    	switch(s) {
    		case "Sightseeing":
    			return "blue";
    		case "Event":
    			return "yellow";
    		case "Nature":
    			return "green";
    		default:
    			return "blue";
    	}
    },

    profile_img_url(user) {
        switch(user.service) {
            case "Twitter":
                return "http://api.twitter.com/1/users/profile_image?screen_name=" +  user.userName;
            case "Facebook":
                return "https://graph.facebook.com/" + user.userName + "ryuichisakamoto""/picture";
            default:
                return "http://dummyimage.com/25x25/ff6f00/fff&text=+";
        }
    }
};