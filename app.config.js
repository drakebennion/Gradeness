import 'dotenv/config'

export default {
  "expo": {
    "name": "Gradeness",
    "slug": "gradeness",
    "version": "1.0.6",
    "orientation": "portrait",
    "icon": "./assets/icon.jpg",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1C222E",
    },
    "updates": {
      "url": "https://u.expo.dev/ad714b42-ee9b-4763-b2ce-23fcbd430692"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.drakeywakey.gradeness"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.drakeywakey.gradeness",
      "versionCode": 5,
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "ad714b42-ee9b-4763-b2ce-23fcbd430692"
      },
      "firebase": {
        "apiKey": process.env.FIREBASE_API_KEY,
        "authDomain": process.env.FIREBASE_AUTH_DOMAIN,
        "projectId": process.env.FIREBASE_PROJECT_ID,
        "storageBucket": process.env.FIREBASE_STORAGE_BUCKET,
        "messagingSenderId": process.env.FIREBASE_MESSAGING_SENDER_ID,
        "appId": process.env.FIREBASE_APP_ID,
        "measurementId": process.env.FIREBASE_MEASUREMENT_ID
      }
    },
    "owner": "drakeywakey"
  }
}
