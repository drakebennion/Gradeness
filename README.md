# Gradeness

https://gradeness.app

# Running the app

## prerequisite's

Install node: v21.5.0 (npm 10.2.4)

You will need an expo account

1.  go to expo go's website and create an account https://expo.dev/
2.  Request Access to expo project from drakobian

You will need to be invited to contribute to gradeness before pushing code

1. Reach out to drakobian for invite.

You will need to configure your .env file
1. reach out to drakobian for env file values TODO: Create a shared secrets / password manager for sharing creds. 
2. Create `.env` file at the root level of the Gradenss App (inline with package.json)
3. past values into .env file save dont commit! this is gitignored so dont override. 



You should be able to clone the repo and simply

```
npm i
npm start
```

Then you have the option of opening on an emulator, or through the Expo Go app on a physical device

# Tech debt

- uses react-native-material library, but finding it a bit restrictive without adding much, strongly considering removing it
- a way to manage secrets such as environement vars. 
- local development that doesnt need production creds. 
