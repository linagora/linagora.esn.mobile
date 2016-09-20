'use strict';

module.exports = function(dependencies) {

  var mongoose = dependencies('db').mongo.mongoose;
  var MobileApplication = mongoose.model('MobileApplication');

  function get(id) {
    return MobileApplication.findById(id);
  }

  function create(application) {
    let app = new MobileApplication(application);
    return app.save();
  }

  return {
    get: get,
    create: create
  };

};
