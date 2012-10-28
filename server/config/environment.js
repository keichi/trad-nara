var express = require('express');
var mongoStore = require('session-mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
		consumerKey: '3g89M0nq4m8S6rWCtYh2w',
		consumerSecret: 'D3HpxWjLVykBDVC9yk9bK0SsvazEXgo0q7HYk8Sq4',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	function(token, tokenSecret, profile, done) {
		console.log(profile);
	 	User.findOne({userId : profile.id}, function(err, result) {
	 		if (result) {
	 			done(null, result);
	 		} else {
	 			User.create({
	 				userId : profile.id,
	 				name : profile.displayName,
	 				location : '',
	 				userName : profile.displayName,
	 				service : profile.provider,
	 				registered : Date.Now,
	 			}, function (err, user) {
	 				console.log('Created user: ' + user.userId);
	 				done(null, user);
	 			});
	 		}
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
 	User.findOne({userId : id}, function(err, user) {
 		done(err, user);
	});
});

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
	app.use(passport.initialize());
	app.use(passport.session());
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
		passport.authenticate(
			'twitter',
			{ successRedirect: '/', failureRedirect: '/login' }
		)
	);
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.use(app.router);
});
