'use strict';

let q = require('q');

module.exports = function(dependencies) {

  let logger = dependencies('logger');

  function send(message, subscription) {
    logger.debug('GCM Sending message to %s', subscription);
    return q({});
  }

  return {
    send: send
  };

};
