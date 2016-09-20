'use strict';

module.exports = function(dependencies) {

  let sender = require('./sender')(dependencies);

  return {
    sender: sender
  };
};
