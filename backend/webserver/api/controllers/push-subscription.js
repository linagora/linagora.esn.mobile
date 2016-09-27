'use strict';

module.exports = function(dependencies, lib) {

  let logger = dependencies('logger');

  function createOrUpdateSubscription(req, res) {
    let appUuid = req.body.application;

    function create(subscription) {
      lib.pushsubscription.createOrUpdate(subscription).then(result => {
        res.status(200).json(result);
      }, err => {
        logger.error('Can not save subscription', err);
        res.status(500).json({
          error: {
            code: 500,
            message: 'Server Error',
            details: 'Can not save subscription'
          }
        });
      });
    }

    lib.application.getFromUuid(appUuid).then(application => {
      if (!application) {
        return res.status(404).json({error: {code: 404, message: 'Not found', details: 'Application ' + appUuid + ' has not been found'}});
      }

      create({
        token: req.body.token,
        application: application._id,
        device: {
          platform: req.body.device.platform,
          uuid: req.body.device.uuid
        },
        user: req.user._id
      });

    }, err => {
      logger.error('Can not get application', err);
      res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details: 'Can not get application'
        }
      });
    });
  }

  function getUserSubscriptions(req, res) {
    lib.pushsubscription.getForUser(req.user._id).then(result => {
      res.status(200).json(result || []);
    }, err => {
      logger.error('Can not get user subscriptions', err);
      res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details: 'Can not get subscriptions'
        }
      });
    });
  }

  return {
    createOrUpdateSubscription,
    getUserSubscriptions
  };

};
