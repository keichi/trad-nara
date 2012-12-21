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
    property('viewCount', Number, {default: 0, index: true});
    property('wpPostId', Number);
    property('category', String, {default: "Uncategorized"});
    property('slug', String, {index: true});
});
 
var Image = describe('Image', function () {
    property('order', Number);
    property('url', String);
    property('caption', String);
    property('postId', String);
});

var User = describe('User', function() {
    property('userId', String);
    property('name', String);
    property('userName', String);
    property('registered', Date, {default: function() {return new Date;}});
    property('service', String);
});

var FavoriteList = describe('FavoriteList', function() {
    property('name', String);
    property('userListId', String);
});

var FavoriteRelation = describe('FavoriteRelation', function() {
    property('listRelationId', String);
    property('postRelationId', String);
});
