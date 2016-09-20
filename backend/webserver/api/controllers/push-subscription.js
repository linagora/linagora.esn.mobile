'use strict';

module.exports = function(dependencies, lib) {

  let logger = dependencies('logger');

  function createOrUpdateSubscription(req, res) {
    lib.pushsubscription.createOrUpdate(req.body).then((result) => {
      res.status(200).json(result);
    }, (err) => {
      logger.error('Can not save token', err);
      res.status(500).json({
        error: {
          code: 500,
          message: 'Server Error',
          details: 'Can not save token'
        }
      });
    });
  }

  return {
    createOrUpdateSubscription: createOrUpdateSubscription
  };

};
