# Gradeness

https://gradeness.app

# Running the app

## Prerequisites

Install node: v21.5.0 (npm 10.2.4)

You will need an expo account

1.  go to expo go's website and create an account https://expo.dev/
2.  Request Access to expo project from drakobian

You will need to be invited to contribute to gradeness before pushing code

1. Reach out to drakobian for invite.

You will need to configure your .env file

1. reach out to drakobian for env file values
2. Create `.env` file at the root level of the Gradeness App (inline with package.json)
3. paste values into .env file save (don't commit! this is gitignored so dont override.)

You should then be able to run

```
npx expo install
npm start
```

Then you have the option of opening on an emulator, or through the Expo Go app on a physical device

# Notifications

- Only work on a physical device
- If trying to get notifications working locally, should work on iOS, but may need an extra file for Android devices - ask Drake for that file, because it contains secrets

# Tech debt

- Create a shared secrets / password manager for sharing creds.
- a way to manage secrets such as environment vars.
- local development that doesnt need production creds.
- fix `@react-native-community/datetimepicker` dependency version - `7.6.1` fails the build entirely, but `7.6.3` throws a warning by expo. (This may just be waiting for expo to fix this)
