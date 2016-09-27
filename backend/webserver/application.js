'use strict';

let express = require('express');
let FRONTEND_PATH = require('./constants').FRONTEND_PATH;

module.exports = function() {
  let application = express();

  application.use(express.static(FRONTEND_PATH));
  require('./config/views')(application);

  return application;
};
