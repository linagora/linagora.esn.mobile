(function() {
  'use strict';

  angular.module('linagora.esn.mobile')
    .factory('mobPushSubscriptionClient', pushSubscriptionClient);

  pushSubscriptionClient.$inject = [
    'mobRestangular'
  ];

  function pushSubscriptionClient(mobRestangular) {
    function save(subscription) {
      return mobRestangular.one('push').all('subscriptions').customPOST(subscription);
    }

    return {
      save: save
    };
  }
})();
