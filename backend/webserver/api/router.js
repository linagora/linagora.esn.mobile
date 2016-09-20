'use strict';

var express = require('express');

module.exports = function(dependencies, lib) {

  var authorizationMW = dependencies('authorizationMW');
  var pushSubscriptionController = require('./controllers/push-subscription')(dependencies, lib);
  var router = express.Router();

  router.post('/push/subscription', authorizationMW.requiresAPILogin, pushSubscriptionController.createOrUpdateSubscription);

  return router;
};
