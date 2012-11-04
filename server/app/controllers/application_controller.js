before('protect from forgery', function () {
    protectFromForgery('69e6db21e0a87b2204b9df6180519e32b7d3f6c7');
}, {
    only : [],
});

before(function() {
    var port = req.port;

    this.user = req.user;
    this.path = req.path;
    this.url = req.protocol + '://' + req.headers.host + req.path;

    next();
});