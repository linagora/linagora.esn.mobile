# linagora.esn.mobile

This modules provides mobile application support in OpenPaaS.

## Push Notifications

### Workflow

- Each time the user signs in the app, the app must ask a token to the Push provider (Google or Apple are supported for now)
- The Push provider will send back a token linked to the user device
- The app must call the OP backend to save this token by using the /api/mobile/push/subscription endpoint
- The backend can now send Push notification to devices by using this token and sending a push request to the provider

### Configure

In order to be able to send Push notifications to devices, you need to configure the Push provider and OpenPaaS.

#### Push Provider

We recommend to use Firebase Cloud Messaging since it supports both Android and iOS notifications: [https://firebase.google.com/docs/cloud-messaging/](https://firebase.google.com/docs/cloud-messaging/)

#### OpenPaaS

In order to use the push notification module, you have to declare mobile applications. While waiting for a management module, you have to add documents in MongoDB. For example, the org.la-cerise application can be declared as a document in the **mobileapplications** document:

```json
{
  "name": "La Cerise",
  "uuid": "org.la-cerise",
  "platforms": [
    {
      "name": "android",
      "uuid": "org.la_cerise",
      "push": {
        "provider": "firebase",
        "api_key": "THE API KEY FROM FIREBASE CONSOLE"
      }
    },
    {
      "name": "ios",
      "uuid": "org.la-cerise",
      "push": {
        "provider": "firebase",
        "api_key": "THE API KEY FROM FIREBASE CONSOLE"
      }
    }
  ]
}
```

This means that the application named 'La Cerise' with uuid 'org.la-cerise' is available for both android and iOS. Each instance is configured to use the firebase push notification provider.

Once saved you can start sending notifications to registered devices by using the lib.sender API.
