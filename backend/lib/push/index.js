'use strict';

module.exports = function(dependencies, lib) {

  let sender = require('./sender')(dependencies, lib);

  return {
    sender
  };
};
