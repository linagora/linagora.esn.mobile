'use strict';

module.exports = function(dependencies) {

  let mongoose = dependencies('db').mongo.mongoose;
  let ObjectId = mongoose.Schema.ObjectId;
  let MobilePushSubscriptionSchema = new mongoose.Schema({
    user: {type: ObjectId, ref: 'User', required: true},
    application: {type: ObjectId, ref: 'MobileApplication', required: true},
    device: {
      uuid: {type: String, required: true},
      platform: {type: String, required: true},
    },
    token: {type: String, required: true},
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    schemaVersion: {type: Number, default: 1}
  });

  return mongoose.model('MobilePushSubscription', MobilePushSubscriptionSchema);
};
