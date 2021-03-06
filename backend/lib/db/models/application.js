'use strict';

module.exports = function(dependencies) {

  let mongoose = dependencies('db').mongo.mongoose;

  let MobileApplicationPlatform = new mongoose.Schema({
    // iOS, android, windows...
    name: {type: String, required: true},
    // ID registered in the App stores
    uuid: {type: String},
    store_url: {type: String},
    push: mongoose.Schema.Types.Mixed
  });

  let MobileApplicationSchema = new mongoose.Schema({
    // the application name (human readable)
    name: {type: String, required: true},
    // an unique identifier for the application within the OP platform
    uuid: {type: String, required: true},
    timestamps: {
      creation: {type: Date, default: Date.now}
    },
    // list of platforms where the application is available
    platforms: {type: [MobileApplicationPlatform]},
    schemaVersion: {type: Number, default: 1}
  });

  return mongoose.model('MobileApplication', MobileApplicationSchema);
};
