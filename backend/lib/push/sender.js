'use strict';

let Q = require('q');

module.exports = function(dependencies) {

  let transports = {
    android: require('./transport/gcm')(dependencies),
    ios: require('./transport/apns')(dependencies)
  };

  let pushSubcriptionModule = require('../push-subscription')(dependencies);

  function getTransport(subscription) {
    return transports[subscription.application_platform];
  }

  function sendToSubscription(message, subscription) {
    return getTransport(subscription).then((transport) => {
      if (!transport) {
        return Q.reject(new Error('No transport has been found for subcription ' + subscription._id));
      }
      return transport.send(message, subscription);
    });
  }

  function getUserSubscriptions(user) {
    return pushSubcriptionModule.getForUser(user);
  }

  function send(message, users) {
    return Q.all(users.map((user) => {
      return getUserSubscriptions(user).then((subscriptions) => {
        if (!subscriptions || !subscriptions.length) {
          return Q.when([]);
        }

        return Q.all(subscriptions.map((subscription) => {
          return sendToSubscription(message, subscription);
        }));
      });
    }));
  }

  return {
    send: send,
    getUserSubscriptions: getUserSubscriptions,
    sendToSubscription: sendToSubscription
  };
};
