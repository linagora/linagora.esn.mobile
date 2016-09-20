'use strict';

module.exports = function(dependencies) {

  let logger = dependencies('logger');
  let models = require('./db')(dependencies);
  let push = require('./push')(dependencies);
  let application = require('./application')(dependencies);
  let pushsubscription = require('./push-subscription')(dependencies);

  function start() {
    logger.info('Starting the mobile module');
  }

  return {
    application: application,
    pushsubscription: pushsubscription,
    push: push,
    models: models,
    start: start
  };
};
