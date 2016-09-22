# linagora.esn.chat

This modules provides mobile application support in OpenPaaS.

## Push Notifications

### Workflow

- Each time the user signs in the app, the app must ask a token to the Push provider (Google or Apple are supported for now)
- The Push provider will send back a token linked to the user device
- The app must call the OP backend to save this token by using the /api/mobile/push/subscription endpoint
- The backend can now send Push notification to devices by using this token and sending a push request to the provider


