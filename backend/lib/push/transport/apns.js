'use strict';

let Q = require('q');

module.exports = function(dependencies) {

  return function(applicationPlatform) {

    function send(message, subscription) {
      return Q.reject('APNS is not implemented, you should use Firebase provider');
    }

    return {
      send: send
    };
  };
};
