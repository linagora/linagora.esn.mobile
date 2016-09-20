'use strict';

var express = require('express');
var FRONTEND_PATH = require('./constants').FRONTEND_PATH;

module.exports = function(dependencies) {
  var application = express();

  application.use(express.static(FRONTEND_PATH));
  require('./config/views')(dependencies, application);

  return application;
};
