'use strict';

module.exports = function(dependencies) {

  let logger = dependencies('logger');
  let models = require('./db')(dependencies);
  let application = require('./application')(dependencies);
  let pushsubscription = require('./push-subscription')(dependencies);
  let push = require('./push')(dependencies, {application, pushsubscription});

  function start(callback) {
    logger.info('Starting the mobile module');
    callback();
  }

  return {
    application,
    pushsubscription,
    push,
    models,
    start
  };
};
