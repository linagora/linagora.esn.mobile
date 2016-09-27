(function() {
  'use strict';

  angular.module('linagora.esn.mobile')
    .factory('mobRestangular', mobRestangular);

  mobRestangular.$inject = [
    'Restangular'
  ];

  function mobRestangular(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/mobile/api');
      RestangularConfigurer.setFullResponse(true);
    });
  }
})();
