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

    profile_img_url : function(user) {
        switch(user.service.toLowerCase()) {
            case "twitter":
                return "http://api.twitter.com/1/users/profile_image?screen_name=" +  user.userName;
            case "facebook":
                return "https://graph.facebook.com/" + user.userName + "/picture";
            default:
                return "http://dummyimage.com/25x25/ff6f00/fff&text=+";
        }
    },

    star_icon_class : function(isFavorited) {
        return isFavorited ? "icon-star" : "icon-star-empty";
    },
};