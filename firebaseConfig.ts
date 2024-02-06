import { initializeApp } from 'firebase/app'
// this is a firebase bug, very fun and cool
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebase.apiKey,
  authDomain: Constants.expoConfig.extra.firebase.authDomain,
  projectId: Constants.expoConfig.extra.firebase.projectId,
  storageBucket: Constants.expoConfig.extra.firebase.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebase.messagingSenderId,
  appId: Constants.expoConfig.extra.firebase.appId,
  measurementId: Constants.expoConfig.extra.firebase.measurementId
}

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

export {
  app,
  auth
}
