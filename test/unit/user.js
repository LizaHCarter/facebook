/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'facebook-test';

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var body = {email:'bob@aol.com', photo:'www.bob.com', tagline:'So cool', facebook:'facebookurl', twitter:'twitterurl', phone:'555-123-4567', visible:'public'},
          u = new User(body);
      expect(u).to.be.instanceof(User);
    });
  });
  describe('.update', function(){
    it('should update a user profile', function(done){
      var body = {email:'bob@aol.com', photo:'www.bob.com', tagline:'So cool', facebook:'facebookurl', twitter:'twitterurl', phone:'555-123-4567', visible:'public'},
          userId = Mongo.ObjectID('000000000000000000000001');
      User.update(body, userId, function(err, user){
        expect(user.photo).to.equal('www.bob.com');
        expect(user.tagline).to.equal('So cool');
        expect(user.facebook).to.equal('facebookurl');
        expect(user.twitter).to.equal('twitterurl');
        expect(user.visible).to.equal('public');
        done();
      });
    });
  });
});

