'use strict';

let Q = require('q');

module.exports = function() {

  return function() {

    function send() {
      return Q.reject('APNS is not implemented, you should use Firebase provider');
    }

    return {
      send: send
    };
  };
};
