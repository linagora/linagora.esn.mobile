'use strict';

module.exports = function(dependencies) {

  let application = require('./models/application')(dependencies);
  let subscription = require('./models/push-subscription')(dependencies);

  return { application, subscription };
};
