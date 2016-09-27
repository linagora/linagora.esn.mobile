'use strict';

let Q = require('q');
let _ = require('lodash');

module.exports = function(dependencies, lib) {

  let transports = {
    android: require('./transport/gcm')(dependencies),
    ios: require('./transport/apns')(dependencies),
    firebase: require('./transport/firebase')(dependencies)
  };

  let pushSubcriptionModule = lib.pushsubscription;
  let applicationModule = lib.application;

  function getTransport(application, subscription) {
    let platform = subscription && subscription.device && subscription.device.platform ? subscription.device.platform.toLowerCase() : undefined;

    if (!platform) {
      return Q.reject(new Error('Subscription is not valid'));
    }

    let applicationPlatform = _.find(application.platforms, item => item.name.toLowerCase() === platform.toLowerCase());

    if (!applicationPlatform) {
      return Q.reject(new Error('Can not find application plaform from subscription platform'));
    }

    if (!applicationPlatform.push || !applicationPlatform.push.provider) {
      return Q.reject(new Error('Provider has not been defined for application platform'));
    }

    return Q.resolve(transports[applicationPlatform.push.provider](applicationPlatform));
  }

  function sendToSubscription(application, message, subscription) {
    return getTransport(application, subscription).then(transport => {
      if (!transport) {
        return Q.reject(new Error('No transport has been found for subcription ' + subscription._id));
      }

      return transport.send(message, [subscription]);
    });
  }

  function sendToSubscriptions(application, message, subscriptions) {
    return Q.all(subscriptions.map(subscription => sendToSubscription(application, message, subscription)));
  }

  function getApplicationSubscriptionsOfUser(applicationId, userId) {
    return pushSubcriptionModule.getByAppForUser(applicationId, userId);
  }

  function sendToApplicationUuid(applicationUuid, message, usersId) {

    return applicationModule.getFromUuid(applicationUuid).then(application => {

      if (!application) {
        return Q.reject(new Error('Application ' + applicationUuid + ' has not been found'));
      }

      return Q.all(usersId.map(userId => getApplicationSubscriptionsOfUser(application._id, userId).then(subscriptions => {
        if (!subscriptions || !subscriptions.length) {
          return Q.when([]);
        }

        return sendToSubscriptions(application, message, subscriptions);
      })));
    });
  }

  return {
    sendToApplicationUuid,
    sendToSubscriptions,
    sendToSubscription,
    getTransport
  };
};
