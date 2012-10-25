var express = require('express');
var everyauth = require('everyauth');
var mongoStore = require('session-mongoose');

everyauth.everymodule
// .handleLogout( function(req, res){
//         req.logout(); // The logout method is added for you by everyauth, too
//         this.redirect(res, this.logoutRedirectPath());
//     })
.moduleErrback(function(err){
	//この処理はエラー回避に必要
	console.log(err)
})
.findUserById( function(userId, callback) {
	User.findOne({userId : userId}, function(err, user) {
		callback(null, user);
	});
});

everyauth.twitter
.consumerKey('3g89M0nq4m8S6rWCtYh2w')
.consumerSecret('D3HpxWjLVykBDVC9yk9bK0SsvazEXgo0q7HYk8Sq4')
.moduleTimeout(10000)
.findOrCreateUser(
	function(session, accessToken, accessTokenSecret, twitterUserData){
	 	var promise = this.Promise();

	 	User.findOne({userId : twitterUserData.id}, function(err, result) {
	 		if (result) {
	 			promise.fulfill({id: 'twitter:' + twitterUserData.id});
	 		} else {
	 			User.create({
	 				userId : 'twitter:' + twitterUserData.id,
	 				name : twitterUserData.name,
	 				location : twitterUserData.location,
	 				userName : twitterUserData.screen_name,
	 				service : 'Twitter',
	 				registered : Date.Now,
	 			}, function (err, user) {
	 				console.log('Created user: ' + user.userId);
	 				promise.fulfill({id: 'twitter:' + twitterUserData.id});
	 			});
	 		}
		});

		return promise;
	}
)
.redirectPath('/');


everyauth.facebook
.appId('385327488206734')
.appSecret('1b9102af844b31ce167bcd3c315a6316')
.findOrCreateUser(
	function(session,accessToken,accessTokExtra,fbUserMetadata){
		var promise = this.Promise();
		promise.fulfill();

	 	User.findOne({userId : fbUserMetadata.id}, function(err, result) {
	 		if (result) {
	 			promise.fulfill({id: 'facebook:' + fbUserMetadata.id});
	 		} else {
	 			User.create({
	 				userId : 'facebook:' + fbUserMetadata.id,
	 				name : fbUserMetadata.name,
	 				location : fbUserMetadata.location.name,
	 				userName : fbUserMetadata.username,
	 				service : 'Facebook',
	 				registered : Date.Now,
	 			}, function (err, user) {
	 				console.log('Created user: ' + user.userId);
	 				promise.fulfill({id: 'facebook:' + fbUserMetadata.id});
	 			});
	 		}
		});
				  
		return user;  
	}
)
.redirectPath('/');

app.configure(function(){
	var cwd = process.cwd();
	
	app.use(express.static(cwd + '/public', {maxAge: 86400000}));
	app.set('view engine', 'ejs');
	app.set('view options', {complexNames: true});
	app.set('jsDirectory', '/javascripts/');
	app.set('cssDirectory', '/stylesheets/');
	app.use(express.bodyParser());
	app.use(express.cookieParser('secret'));

	var mongooseSessionStore = new mongoStore({
		url: "mongodb://localhost/trad_session",
		interval: 120000 
	});
	app.use(express.session({cookie: {maxAge: 120000}, store: mongooseSessionStore, secret: "secret" }));
	app.use(express.methodOverride());
	app.use(everyauth.middleware(app)) //追加
	app.use(app.router);
});
