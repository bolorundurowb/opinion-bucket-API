/**
 * Created by bolorundurowb on 1/13/17.
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

describe('Categories', function () {
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
    describe('does not allow', function () {
      it('for categories to be duplicated', function (done) {
        server
          .post('/api/v1/categories')
          .set('x-access-token', adminToken)
          .send({title: 'Tech'})
          .expect(409)
          .end(function (err, res) {
            res.status.should.equal(409);
            res.body.message.should.equal('A category exists with that title');
            done();
          });
      });

      it('for categories to be title-less', function (done) {
        server
          .post('/api/v1/categories')
          .set('x-access-token', adminToken)
          .send({})
          .expect(400)
          .end(function (err, res) {
            res.status.should.equal(400);
            res.body.message.should.equal('The category requires a title');
            done();
          });
      });
    });

    describe('allows', function () {
      it('for  categories to be created', function (done) {
        server
          .post('/api/v1/categories')
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
  });

  describe('retrieval', function () {
    describe('does not allow', function () {
      it('for a non-existent category to be retrieved', function (done) {
        server
          .get('/api/v1/categories/507f1f77bcf86cd799439011')
          .set('x-access-token', userToken)
          .expect(400)
          .end(function (err, res) {
            res.status.should.equal(400);
            res.body.message.should.equal('No category exists with that id');
            done();
          });
      });
    });

    describe('allows', function () {
      it('for  all categories to be retrieved', function (done) {
        server
          .get('/api/v1/categories')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.length.should.equal(1);
            done();
          });
      });

      it('for  a category to be retrieved', function (done) {
        server
          .get('/api/v1/categories/' + id)
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

  describe('update', function () {
    describe('does not allow', function () {
      it('for categories to be title-less', function (done) {
        server
          .put('/api/v1/categories/' + id)
          .set('x-access-token', adminToken)
          .send({})
          .expect(400)
          .end(function (err, res) {
            res.status.should.equal(400);
            res.body.message.should.equal('The category requires a title');
            done();
          });
      });
    });

    describe('allows', function () {
      it('for  categories to be updated', function (done) {
        server
          .put('/api/v1/categories/' + id)
          .set('x-access-token', adminToken)
          .send({title: 'Technology'})
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.should.be.type('object');
            res.body.title.should.equal('Technology');
            done();
          });
      });
    });
  });

  describe('deletion', function () {
    describe('allows', function () {
      it('for  categories to be deleted', function (done) {
        server
          .delete('/api/v1/categories/' + id)
          .set('x-access-token', adminToken)
          .expect(200)
          .end(function (err, res) {
            res.status.should.equal(200);
            res.body.message.should.equal('Category successfully removed');
            done();
          });
      });
    });
  });
});
