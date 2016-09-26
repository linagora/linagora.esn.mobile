'use strict';

let AwesomeModule = require('awesome-module');
let Dependency = AwesomeModule.AwesomeModuleDependency;

let NAME = 'mobile';
let MODULE_NAME = 'linagora.esn.' + NAME;

let modbileAppModule = new AwesomeModule(MODULE_NAME, {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.logger', 'logger'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.pubsub', 'pubsub'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.wrapper', 'webserver-wrapper'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.authorization', 'authorizationMW'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.user', 'user'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.db', 'db')
  ],
  states: {
    lib: function(dependencies, callback) {
      let libModule = require('./backend/lib')(dependencies);
      let api = require('./backend/webserver/api')(dependencies, libModule);

      return callback(null, {
        lib: libModule,
        api: api
      });
    },

    deploy: function(dependencies, callback) {
      let app = require('./backend/webserver/application')(this, dependencies);
      app.use('/api', this.api);

      let webserverWrapper = dependencies('webserver-wrapper');
      let frontendModules = [
        'mobile.app.js',
        'restangular.service.js',
        'application-client.service.js',
        'push-subscription-client.service.js'
      ];
      webserverWrapper.injectAngularModules(NAME, frontendModules, MODULE_NAME, ['esn']);
      webserverWrapper.addApp(NAME, app);
      return callback();
    },

    start: function(dependencies, callback) {
      this.lib.start(callback);
    }
  }
});

module.exports = modbileAppModule;
