/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'template-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the edit profile page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('bob@aol.com');
        expect(res.text).to.include('Email');
        expect(res.text).to.include('Phone');
        expect(res.text).to.include('Public');
        done();
      });
    });
  });

  describe('put /profile', function(){
    it('should edit the profile', function(done){
      request(app)
      .post('/profile')
      .send('_method=put&email=bob%40aol.com&photo=www.bob.com&tagline=So+cool%21&facebook=facebookurl&twitter=twitterurl&phone=555-123-4567&visible=public')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});

