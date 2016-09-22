'use strict';

module.exports = function(dependencies) {

  var mongoose = dependencies('db').mongo.mongoose;
  var MobilePushSubscription = mongoose.model('MobilePushSubscription');

  function get(id) {
    return MobilePushSubscription.findById(id);
  }

  function getByAppForUser(applicationId, userId) {
    return MobilePushSubscription.find({user: userId, application: applicationId});
  }

  function getForUser(userId) {
    return MobilePushSubscription.find({user: userId});
  }

  function create(subscription) {
    return new MobilePushSubscription(subscription).save();
  }

  function createOrUpdate(subscription) {
    return MobilePushSubscription.findOneAndUpdate({
      user: subscription.user,
      application: subscription.application,
      'device.uuid': subscription.device.uuid
    }, subscription, {new: true, upsert: true}).exec();
  }

  return {
    get: get,
    getByAppForUser: getByAppForUser,
    getForUser: getForUser,
    create: create,
    createOrUpdate: createOrUpdate
  };

};
