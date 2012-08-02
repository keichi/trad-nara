var express = require('express');
var everyauth = require('everyauth');

everyauth.everymodule
// .handleLogout( function(req, res){
//         req.logout(); // The logout method is added for you by everyauth, too
//         this.redirect(res, this.logoutRedirectPath());
//     })
.moduleErrback(function(err){
    //この処理はエラー回避に必要
    console.log(err)
});

everyauth.twitter
.consumerKey('3g89M0nq4m8S6rWCtYh2w')
.consumerSecret('D3HpxWjLVykBDVC9yk9bK0SsvazEXgo0q7HYk8Sq4')
.moduleTimeout(10000)
.findOrCreateUser(
    function(session, accessToken, accessTokenSecret, twitterUserData){
      var promise = this.Promise();
      promise.fulfill();

      var user = {};
      user.name = twitterUserData.name;
      user.accessToken = accessToken;
      user.accessTokenSecret = accessTokenSecret;
      session.user = user;

      return promise;
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
    app.use(express.session({secret: 'secret'}));
    app.use(express.methodOverride());
    app.use(everyauth.middleware()) //追加
    app.use(app.router);
});

