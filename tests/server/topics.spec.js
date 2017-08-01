/**
 * Created by bolorundurowb on 1/16/17.
 */

const supertest = require('supertest');
// eslint-disable-next-line
const should = require('should');
const app = require('./../../server');
const config = require('../../src/server/config/config');

const server = supertest.agent(app);
var id = '';
var userToken;
var adminToken;

describe('Topics', function () {
  before(function (done) {
    server
      .post('/api/v1/signin')
      .send({
        username: 'john.doe',
        password: 'john.doe'
      })
      .expect(200)
      .end(function (err, res) {
        userToken = res.body.token;

        server
          .post('/api/v1/signin')
          .send({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASS
          })
          .expect(200)
          .end(function (err, res) {
            adminToken = res.body.token;
            done();
          });
      });
  });

  describe('creation', function () {
    describe('allows', function () {
      it('for topics to be created', function (done) {
        server
          .post('/api/v1/topics')
          .set('x-access-token', adminToken)
          .send({title: 'Tech'})
          .expect(201)
          .end(function (err, res) {
            id = res.body._id || '';
            res.status.should.equal(201);
            res.body.should.be.type('object');
            res.body.title.should.equal('Tech');
            done();
          });
      });
    });

    describe('does not allow', function () {
      it('for topics to be duplicated', function (done) {
        server
          .post('/api/v1/topics')
          .set('x-access-token', adminToken)
          .send({title: 'Tech'})
          .expect(409)
          .end(function (err, res) {
            res.status.should.equal(409);
            res.body.message.should.equal('A topic exists with that title');
            done();
          });
      });

      it('for topics to be title-less', function (done) {
        server
          .post('/api/v1/topics')
          .set('x-access-token', adminToken)
          .send({})
          .expect(400)
          .end(function (err, res) {
            res.status.should.equal(400);
            res.body.message.should.equal('The topic requires a title');
            done();
          });
      });
    });
  });

  describe('updating', function () {
    describe('does not allow', function () {
      it('for wrong category ids', function (done) {
        server
          .put('/api/v1/topics/' + id)
          .set('x-access-token', userToken)
          .send({
            categories: '507f1f77bcf86cd79'
          })
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });

      it('for non-existent ids', function (done) {
        server
          .put('/api/v1/topics/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(404)
          .end(function (err, res) {
            res.status.should.equal(404);
            res.body.should.be.type('object');
            res.body.message.should.equal('A topic with that id doesn\'t exist');
            done();
          });
      });
    });

    describe('allows', function () {
      it('for topics to be updated', function (done) {
        server
          .put('/api/v1/topics/' + id)
          .set('x-access-token', userToken)
          .send({
            title: 'Technology',
            content: 'New content',
            categories: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd79']
          })
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.title.should.equal('Technology');
            res.body.content.should.equal('New content');
            done();
          });
      });
    });
  });

  describe('retrieval', function () {
    describe('does not allow', function () {
      it('doesnt allow a non-existent topic to be retrieved', function (done) {
        server
          .get('/api/v1/topics/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(404)
          .end(function (err, res) {
            res.status.should.equal(404);
            res.body.message.should.equal('No topic exists with that id');
            done();
          });
      });

      it('doesnt allow a non-existent topic to be retrieved with more detail', function (done) {
        server
          .get('/api/v1/topics/507f1f77bcf86cd799439011/full')
          .set('x-access-token', userToken)
          .expect(404)
          .end(function (err, res) {
            res.status.should.equal(404);
            res.body.message.should.equal('No topic exists with that id');
            done();
          });
      });
    });

    describe('allows', function () {
      it('for all topics to be retrieved', function (done) {
        server
          .get('/api/v1/topics')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(2);
            done();
          });
      });

      it('for topics to be retrieved with query options', function (done) {
        server
          .get('/api/v1/topics?limit=12&offset=10&order=date')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(0);
            done();
          });
      });

      it('for topics to be retrieved with query options but sanitizes input', function (done) {
        server
          .get('/api/v1/topics?category=50e76f592&order=opinion')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(2);
            done();
          });
      });

      it('for a topic to be retrieved', function (done) {
        server
          .get('/api/v1/topics/' + id)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });

      it('for a topic to be retrieved with more detail', function (done) {
        server
          .get('/api/v1/topics/' + id + '/full')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            done();
          });
      });
    });
  });

  describe('deletion', function () {
    describe('allows', function () {
      it('for topics to be deleted', function (done) {
        server
          .delete('/api/v1/topics/' + id)
          .set('x-access-token', adminToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.message.should.equal('Topic successfully removed');
            done();
          });
      });
    });
  });
});
