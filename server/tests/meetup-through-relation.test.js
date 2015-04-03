var assert = require('chai').assert,
  expect = require('chai').expect,
  should = require('chai').should(),
  request = require('supertest'),
  loopback = require('loopback'),
  app = require('../../');

app.use(loopback.rest());

var api = request(app);

describe('Person Meetup Relations', function() {

  var SherlockHolmes = {
    firstName: 'Sherlock',
    lastName: 'Holmes'
  };

  var JohnWatson = {
    firstName: 'John',
    lastName: 'Watson'
  };

  var InviteOne = {
    name: 'Sherlock Holmes',
    status: 'invited'
  };

  var InviteTwo = {
    name: 'John Watson',
    status: 'invited'
  };

  var MeetupOne = {
    title: 'Bristol Crime Scene'
  };

  var MeetupTwo = {
    title: 'London Crime Scene'
  };

  describe('Create new people', function () {
    it('should create sherlock holmes person object', function(done) {
      api.post('/people')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(SherlockHolmes)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');

          SherlockHolmes = res.body;

          done();
        });
    });

    it('should create john watson person object', function(done) {
      api.post('/people')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(JohnWatson)
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');

          JohnWatson = res.body;

          done();
        });
    });
  });

  describe('POST to /meetup/ and add invites via relation', function () {
    it('create meetup object', function (done) {
      api.post('/meetups/')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(MeetupOne)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');
          res.body.should.have.property('title', MeetupOne.title);

          MeetupOne = res.body;

          done();
        });
    });

    it('should add first invite to meetup via person', function (done) {
      api.put('/people/' + JohnWatson.id + '/meetups/rel/'+MeetupOne.id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(InviteTwo)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');
          res.body.should.have.property('personId', JohnWatson.id);
          res.body.should.have.property('meetupId', MeetupOne.id);
          res.body.should.have.property('name', InviteTwo.name);
          res.body.should.have.property('status', InviteTwo.status);

          done();
        });
    });

    it('should add second invite to meetup via person', function (done) {
      api.put('/people/' + SherlockHolmes.id + '/meetups/rel/'+MeetupOne.id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(InviteOne)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');
          res.body.should.have.property('personId', SherlockHolmes.id);
          res.body.should.have.property('meetupId', MeetupOne.id);
          res.body.should.have.property('name', InviteOne.name);
          res.body.should.have.property('status', InviteOne.status);

          done();
        });
    });
  });

  describe('POST to /people/{id}/meetups and add invites via relation', function () {
   it('create meetup object', function (done) {
      api.post('/people/' + JohnWatson.id + '/meetups')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(MeetupTwo)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');
          res.body.should.have.property('title', MeetupTwo.title);

          MeetupTwo = res.body;

          done();
        });
    });

    it('should add first invite to meetup via person', function (done) {
      api.put('/people/' + JohnWatson.id + '/meetups/rel/'+MeetupTwo.id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(InviteTwo)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');
          res.body.should.have.property('personId', JohnWatson.id);
          res.body.should.have.property('meetupId', MeetupTwo.id);
          res.body.should.have.property('name', InviteTwo.name);
          res.body.should.have.property('status', InviteTwo.status);

          done();
        });
    });

    it('should add second invite to meetup via person', function (done) {
      api.put('/people/' + SherlockHolmes.id + '/meetups/rel/'+MeetupTwo.id)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(InviteOne)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          res.body.should.be.instanceOf(Object);
          res.body.should.have.property('id');
          res.body.should.have.property('personId', SherlockHolmes.id);
          res.body.should.have.property('meetupId', MeetupTwo.id);
          res.body.should.have.property('name', InviteOne.name);
          res.body.should.have.property('status', InviteOne.status);

          done();
        });
    });
  });
});
