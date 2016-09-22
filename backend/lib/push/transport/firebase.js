'use strict';

let Q = require('q');
let gcm = require('node-gcm');
const PROVIDER_NAME = 'firebase';

module.exports = function(dependencies) {

  let logger = dependencies('logger');

  function send(application, message, subscriptions) {
    if (application.push.provider !== PROVIDER_NAME) {
      return Q.reject(new Error(application.push.provider + ' is not compatible with Firebase transport'));
    }

    let defer = Q.defer();
    let service = new gcm.Sender(application.push.api_key);
    let gcmMessage = new gcm.Message();

    gcmMessage.addData(message);
    service.send(gcmMessage, {registrationTokens: subscriptions.map(subscription => subscription.token)}, function(err, response) {
      if (err) {
        logger.error('Error while sending Firebase message', err);
        return defer.reject(err);
      }
      defer.resolve(response);
    });

    return defer.promise;
  }

  return {
    send: send
  };

};
