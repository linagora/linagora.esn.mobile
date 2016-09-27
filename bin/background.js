'use strict';

let gcm = require('node-gcm');

let apiKey = 'YOUR API KEY';
let deviceID = 'YOUR DEVICE';

let service = new gcm.Sender(apiKey);
let message = new gcm.Message();
message.addData('title', 'AwesomePaaS rocks!');
message.addData('body', 'Check it out on http://open-paas.org');

service.send(message, {registrationTokens: [deviceID]}, function (err, response) {
  if (err) {
    return console.error(err);
  }
  console.log(response);
});
