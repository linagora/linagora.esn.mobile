'use strict';

let Q = require('q');
const PROVIDER_NAME = 'apns';

module.exports = function(dependencies) {

  function send(application, message, subscription) {
    if (application.push.provider !== PROVIDER_NAME) {
      return Q.reject(new Error(application.push.provider + ' is not compatible with Apple APNS transport'));
    }

    return Q.reject('APNS is not implemented, you should use Firebase provider');
  }

  return {
    send: send
  };

};
