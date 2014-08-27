'use strict';

var bcrypt = require('bcrypt'),
    Mongo  = require('mongodb');

function User(o){
  this.email = o.email;
  this.photo = o.photo;
  this.tagline = o.tagline;
  this.facebook = o.facebook;
  this.twitter = o.twitter;
  this.phone = o.phone;
  this.visible = o.visible;
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, cb);
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(user){return cb();}
    o.password = bcrypt.hashSync(o.password, 10);
    User.collection.save(o, cb);
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    if(!isOk){return cb();}
    cb(user);
  });
};

User.update = function(o, userId, cb){
  User.collection.findOne({userId:userId}, function(err, user){
    User.collection.save(o, cb);
  });
};

module.exports = User;

