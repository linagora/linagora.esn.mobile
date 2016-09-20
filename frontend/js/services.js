'use strict';

angular.module('linagora.esn.mobile')

  .factory('esnMobileApplicationClient', function(esnMobileRestangular) {

    function getApplication(appId) {
      return esnMobileRestangular.all('applications').get({application: appId});
    }

    return {
      getApplication: getApplication
    };

  })

  .factory('esnMobilePushSubscriptionClient', function(esnMobileRestangular) {

    function save(subscription) {
      return esnMobileRestangular.one('push').one('subscription').customPOST(subscription);
    }

    return {
      save: save
    };

  });
