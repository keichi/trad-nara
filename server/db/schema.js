/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/

var Post = describe('Post', function () {
    property('author', String);
    property('title', String);
    property('lead', Text);
    property('body', Text);
    property('address', String);
    property('label', String);
    property('created', Date);
    property('modified', Date);
    property('topimage', String);
    property('viewCount', Number, {default: 0});
    property('wpPostId', Number);
});

var Image = describe('Image', function () {
    property('order', Number);
    property('url', String);
    property('caption', String);
});

Post.hasMany(Image, {as: 'images', foreignKey: 'postId'});
Image.belongsTo(Post, {as: 'post', foreignKey: 'postId'});;

var User = describe('User', function() {
    property('name', String);
    property('location', String);
    property('username', String);
    property('registered', Date, {default: Date.Now});
    property('service', String);
});
