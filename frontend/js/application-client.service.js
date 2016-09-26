(function() {
  'use strict';

  angular.module('linagora.esn.mobile')
    .factory('mobApplicationClient', mobileApplicationClient);

  function mobileApplicationClient(mobRestangular) {
    function getApplication(appId) {
      return mobRestangular.all('applications').get({application: appId});
    }

    return {
      getApplication: getApplication
    };
  }
})();
