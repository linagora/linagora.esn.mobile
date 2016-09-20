'use strict';

module.exports = function(dependencies) {

  let mongoose = dependencies('db').mongo.mongoose;
  let ObjectId = mongoose.Schema.ObjectId;
  let MobilePushSubscriptionSchema = new mongoose.Schema({
    // the user which is linked to this subscription
    user: {type: ObjectId, ref: 'User', required: true},
    application: {type: ObjectId, ref: 'PushApplication', required: true},
    // distinguish for which platform this subscription applies to.
    // provider must be the same as the provider name defined in the PushApplication schema
    application_platform: {type: String, required: true},
    // the subscription token
    token: {type: String, required: true},
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    schemaVersion: {type: Number, default: 1}
  });

  return mongoose.model('MobilePushSubscription', MobilePushSubscriptionSchema);
};
