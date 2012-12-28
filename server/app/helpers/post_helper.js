module.exports = {
	uriencode : function(s){return encodeURI(s);},
	profile_img_url : require('./top_helper').profile_img_url,
	format_date: function(date) {
		var month_names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();

		return month_names[month] + ' ' + day + ', ' + year;
    }
};