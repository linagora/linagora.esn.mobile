'use strict';

angular.module('linagora.esn.mobile')
  .factory('esnMobileRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/mobile/api');
      RestangularConfigurer.setFullResponse(true);
    });
  });
