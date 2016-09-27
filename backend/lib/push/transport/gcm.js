'use strict';

let Q = require('q');
let gcm = require('node-gcm');

module.exports = function(dependencies) {

  let logger = dependencies('logger');

  return function(applicationPlatform) {

    function send(message, subscriptions) {
      let defer = Q.defer();
      let service = new gcm.Sender(applicationPlatform.push.api_key);
      let gcmMessage = new gcm.Message();

      gcmMessage.addData(message);
      service.send(gcmMessage, {registrationTokens: subscriptions.map(subscription => subscription.token)}, function(err, response) {
        if (err) {
          logger.error('Error while sending GCM message', err);

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
};
