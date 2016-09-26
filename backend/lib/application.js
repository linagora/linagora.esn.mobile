'use strict';

module.exports = function(dependencies) {

  let mongoose = dependencies('db').mongo.mongoose;
  let MobileApplication = mongoose.model('MobileApplication');

  function get(id) {
    return MobileApplication.findById(id);
  }

  function getFromUuid(uuid) {
    return MobileApplication.findOne({uuid: uuid});
  }

  function create(application) {
    let app = new MobileApplication(application);
    return app.save();
  }

  return {
    get,
    create,
    getFromUuid
  };
};
