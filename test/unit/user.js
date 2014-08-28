/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
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

  describe('#save', function(){
    it('should save a user profile', function(){
      var u = new User(),
          o = {x: 3, visible:'public', foo:'bar'};

      u.baz = 'bim';
      u.save(o, function(err, user){
        expect(user.isVisible).to.be.true;
        expect(user.foo).to.equal('bar');
        expect(user.baz).to.equal('bim');
      });
    });
  });

  describe('.find', function(){
    it('should show all public users', function(){
      User.find({isVisible:true}, function(err, users){
        expect(users).to.have.length(2);
      });
    });
  });
  describe('.findByEmail', function(){
    it('should show specific profile', function(){
      User.findByEmail('bob@aol.com', function(err, user){
        expect(user.facebook).to.equal('www.facebook.com');
      });
    });
  });
});

