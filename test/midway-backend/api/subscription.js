'use strict';

let request = require('supertest');
let chai = require('chai');
let expect = chai.expect;
let uuidV4 = require('uuid/v4');
let Q = require('q');
let redis = require('redis');
let async = require('async');

describe('The Push API', function() {

  let deps, mongoose, userId, user, app, redisClient, helpers, mobileApp;

  function dependencies(name) {
    return deps[name];
  }

  beforeEach(function(done) {
    mongoose = require('mongoose');
    mongoose.Promise = Q.Promise;
    helpers = this.helpers;
    mongoose.connect(this.testEnv.mongoUrl);
    userId = mongoose.Types.ObjectId();
    redisClient = redis.createClient(this.testEnv.redisPort);

    mobileApp = {
      name: 'OP Mobile App',
      uuid: 'org.open-paas.mobile'
    };

    deps = {
      logger: require('../../fixtures/logger'),
      user: {
      },
      db: {
        mongo: {
          mongoose: mongoose
        },
        redis: {
          getClient: function(callback) {
            callback(null, redisClient);
          }
        }
      },
      authorizationMW: {
        /*eslint no-unused-vars: ["error", {"args": "after-used"}]*/
        requiresAPILogin: function(req, res, next) {
          req.user = {
            _id: userId
          };
          next();
        }
      }
    };

    app = helpers.loadApplication(dependencies);
    var UserSchema = mongoose.model('User');

    user = new UserSchema({
      _id: userId,
      firstname: 'John',
      username: 'john.doe',
      lastname: 'Doe'
    });

    user.save(done);
  });

  afterEach(function(done) {
    async.parallel([helpers.mongo.dropDatabase], done);
  });

  describe('The POST /push/subscriptions endpoint', function() {

    it('should save the subscription', function(done) {
      function apiCall(application) {
        let deferred = Q.defer();
        let subscription = {
          user: String(userId),
          application: application.uuid,
          device: {
            uuid: '123',
            platform: 'android'
          },
          token: uuidV4()
        };

        request(app.express)
          .post('/api/push/subscriptions')
          .send(subscription)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return deferred.reject(err);
            }
            deferred.resolve(res.body);
          });

        return deferred.promise;
      }

      function checkResult(result) {
        if (!result) {
          return done(new Error('Can not get result'));
        }

        app.lib.pushsubscription.getForUser(userId).then(result => {
          expect(result.length).to.equal(1);
          done();
        }, done);
      }

      app.lib.application.create(mobileApp)
        .then(apiCall)
        .then(checkResult)
        .catch(done);
    });

    it('should update the user subscription with the new token if one already exists', function(done) {
      const tokenA = uuidV4();
      const tokenB = uuidV4();
      let createdApp;

      function apiCall() {
        let deferred = Q.defer();
        let subscription = {
          user: String(userId),
          application: createdApp.uuid,
          device: {
            uuid: '123',
            platform: 'android'
          },
          token: tokenB
        };

        request(app.express)
          .post('/api/push/subscriptions')
          .send(subscription)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return deferred.reject(err);
            }
            deferred.resolve(res.body);
          });

        return deferred.promise;
      }

      function checkResult(result) {
        if (!result) {
          return done(new Error('Can not get result'));
        }

        app.lib.pushsubscription.getForUser(userId).then(result => {
          expect(result.length).to.equal(1);
          expect(result[0].token).to.equal(tokenB);
          done();
        }, done);
      }

      function createApp() {
        return app.lib.application.create(mobileApp).then(result => {
          createdApp = result;

          return result;
        });
      }

      function createSubscription() {
        let subscription = {
          user: String(userId),
          application: createdApp._id,
          device: {
            uuid: '123',
            platform: 'android'
          },
          token: tokenA
        };

        return app.lib.pushsubscription.create(subscription);
      }

      createApp()
        .then(createSubscription)
        .then(apiCall)
        .then(checkResult)
        .catch(done);
    });
  });

  it('should not create another subscription when the same subscription data is sent', function(done) {
    const token = uuidV4();
    let createdApp;

    function apiCall() {
      let deferred = Q.defer();
      let subscription = {
        user: String(userId),
        application: createdApp.uuid,
        device: {
          uuid: '123',
          platform: 'android'
        },
        token: token
      };

      request(app.express)
        .post('/api/push/subscriptions')
        .send(subscription)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return deferred.reject(err);
          }
          deferred.resolve(res.body);
        });

      return deferred.promise;
    }

    function checkResult(result) {
      if (!result) {
        return done(new Error('Can not get result'));
      }

      app.lib.pushsubscription.getForUser(userId).then(result => {
        expect(result.length).to.equal(1);
        expect(result[0].token).to.equal(token);
        done();
      }, done);
    }

    function createApp() {
      return app.lib.application.create(mobileApp).then(result => {
        createdApp = result;

        return result;
      });
    }

    createApp()
      .then(apiCall)
      .then(apiCall)
      .then(checkResult)
      .catch(done);
  });
});
