'use strict';

let express = require('express');

module.exports = function(dependencies, lib) {

  let authorizationMW = dependencies('authorizationMW');
  let pushSubscriptionController = require('./controllers/push-subscription')(dependencies, lib);
  let router = express.Router();

  router.get('/push/subscriptions', authorizationMW.requiresAPILogin, pushSubscriptionController.getUserSubscriptions);
  router.post('/push/subscriptions', authorizationMW.requiresAPILogin, pushSubscriptionController.createOrUpdateSubscription);

  return router;
};
