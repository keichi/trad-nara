var express = require('express');
var mongoStore = require('session-mongoose');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

app.configure('production', function () {
    app.SITE_URL = 'http://trads-jp.com/';
});
app.configure('development', function () {
    app.SITE_URL = 'http://localhost:3000/';
});

function findOrCreateUser(profile, done) {
 	User.findOne({userId : profile.id}, function(err, result) {
 		if (err) {
 			return done(err);
 		}
 		if (result) {
 			done(null, result);
 		} else {
 			User.create({
 				userId : profile.id,
 				name : profile.displayName,
 				userName : profile.username,
 				service : profile.provider,
 				registered : Date.Now,
 			}, function (err, user) {
 				if (err) {
 					return done(err);
 				}
 				done(null, user);
 			});
 		}
	});
}

passport.use(new TwitterStrategy({
		consumerKey: '3g89M0nq4m8S6rWCtYh2w',
		consumerSecret: 'D3HpxWjLVykBDVC9yk9bK0SsvazEXgo0q7HYk8Sq4',
		callbackURL: app.SITE_URL + 'auth/twitter/callback'
	},
	function(token, tokenSecret, profile, done) {
		findOrCreateUser(profile, done);
	}
));

passport.use(new FacebookStrategy({
		clientID: '385327488206734',
		clientSecret: '1b9102af844b31ce167bcd3c315a6316',
		callbackURL: app.SITE_URL + 'auth/facebook/callback'
	},
	function(accessToken, refreshToken, profile, done) {
		findOrCreateUser(profile, done);
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
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
		passport.authenticate(
			'facebook',
			{ successRedirect: '/', failureRedirect: '/login' }
		)
	);
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.use(app.router);
});
