'use strict';

let AwesomeModule = require('awesome-module');
let Dependency = AwesomeModule.AwesomeModuleDependency;
let glob = require('glob-all');

const NAME = 'mobile';
const MODULE_NAME = 'linagora.esn.' + NAME;
const FRONTEND_JS_PATH = __dirname + '/frontend/js/';

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
      let webserverWrapper = dependencies('webserver-wrapper');
      let app = require('./backend/webserver/application')(this, dependencies);
      let frontendModules = glob.sync([
        FRONTEND_JS_PATH + '**/*.app.js',
        FRONTEND_JS_PATH + '**/!(*spec).js'
      ]).map(filepath => filepath.replace(FRONTEND_JS_PATH, ''));

      app.use('/api', this.api);
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
