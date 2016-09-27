'use strict';

let mockery = require('mockery');
let expect = require('chai').expect;
let sinon = require('sinon');
let Q = require('q');

describe('The Push sender module', () => {

  function getModule(dependencies, lib) {
    return require('../../../../../backend/lib/push/sender')(dependencies, lib);
  }

  describe('The getTransport function', () => {
    const firebase = {find: 'me'};
    const dependencies = function() {};

    beforeEach(() => {
      mockery.registerMock('./transport/gcm', function() {
        return function() {return {};};
      });

      mockery.registerMock('./transport/apns', function() {
        return function() {return {};};
      });

      mockery.registerMock('./transport/firebase', function() {
        return function() {return firebase;};
      });
    });

    it('should reject when subscription is undefined', done => {
      getModule(dependencies, {}).getTransport().then(done, err => {
        expect(err.message).to.match(/Subscription is not valid/);
        done();
      });
    });

    it('should reject when subscription.device is undefined', done => {
      getModule(dependencies, {}).getTransport(null, {}).then(done, err => {
        expect(err.message).to.match(/Subscription is not valid/);
        done();
      });
    });

    it('should reject when subscription.device.platform is undefined', done => {
      getModule(dependencies, {}).getTransport(null, {device: {}}).then(done, err => {
        expect(err.message).to.match(/Subscription is not valid/);
        done();
      });
    });

    it('should reject when application platform can not be found from subscription platform', done => {
      let platforms = [{name: 'ios'}, {name: 'android'}];

      getModule(dependencies, {}).getTransport({platforms}, {device: {platform: 'windows'}}).then(done, err => {
        expect(err.message).to.match(/Can not find application plaform from subscription platform/);
        done();
      });
    });

    it('should reject when application platform provider can not be found from subscription platform', done => {
      let platforms = [{name: 'ios'}, {name: 'android'}];

      getModule(dependencies, {}).getTransport({platforms}, {device: {platform: 'android'}}).then(done, err => {
        expect(err.message).to.match(/Provider has not been defined for application platform/);
        done();
      });
    });

    it('should resolve with the transport', done => {
      let platforms = [{name: 'ios'}, {name: 'android', push: {provider: 'firebase'}}];

      getModule(dependencies, {}).getTransport({platforms}, {device: {platform: 'android'}}).then(transport => {
        expect(transport).to.deep.equals(firebase);
        done();
      }, done);
    });

  });

  describe('The sendToSubscription function', () => {

    const dependencies = function() {};

    beforeEach(() => {
      mockery.registerMock('./transport/gcm', function() {
        return function() {return {};};
      });

      mockery.registerMock('./transport/apns', function() {
        return function() {return {};};
      });
    });

    it('should reject when getTransport fails', done => {
      let message = {title: 'Hello!'};
      let subscription = {_id: 1, device: {platform: 'ios'}};
      let platforms = [{name: 'ios'}, {name: 'android', provider: 'firebase'}];

      getModule(dependencies, {}).sendToSubscription({platforms}, message, subscription).then(done, err => {
        expect(err).to.exist;
        done();
      });
    });

    it('should call transport', done => {
      let sendSpy = sinon.spy();
      let message = {title: 'Hello!'};
      let subscription = {_id: 1, device: {platform: 'android'}};
      let platforms = [{name: 'ios'}, {name: 'android', push: {provider: 'firebase'}}];

      mockery.registerMock('./transport/firebase', function() {
        return function() {return {send: sendSpy};};
      });

      getModule(dependencies, {}).sendToSubscription({platforms}, message, subscription).then(() => {
        expect(sendSpy).to.haveBeenCalledOnce;
        done();
      }, done);
    });
  });

  describe('The sendToApplicationUuid function', () => {
    beforeEach(() => {
      mockery.registerMock('./transport/gcm', function() {
        return {};
      });

      mockery.registerMock('./transport/apns', function() {
        return {};
      });

      mockery.registerMock('./transport/firebase', function() {
        return {};
      });
    });

    it('should reject when application search rejects', done => {
      const error = 'This is an error';
      let application = {
        getFromUuid: function() {
          return Q.reject(new Error(error));
        }
      };

      getModule({}, {application}).sendToApplicationUuid().then(done, err => {
        expect(err.message).to.equals(error);
        done();
      });
    });

    it('should reject when application can not be found', done => {
      let application = {
        getFromUuid: function() {
          return Q.resolve();
        }
      };

      getModule({}, {application}).sendToApplicationUuid().then(done, err => {
        expect(err.message).to.match(/has not been found/);
        done();
      });
    });
  });
});
