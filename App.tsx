import 'react-native-gesture-handler';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import './firebaseConfig';
import RootNavigation from './src/navigation';
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";

import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// todo: maybe move Notifications into its own hook
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium
  });

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(() => console.log('Registered for notifications'));

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    // todo: show splash screen
    return null;
  }

  return (
    <PaperProvider theme={DefaultTheme}>
      <RootNavigation />
    </PaperProvider>
  );
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
      });
  }

  if (Device.isDevice) {
      const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
      }
      if (finalStatus !== 'granted') {
          handleRegistrationError('Permission not granted to get push token for push notification!');
          return;
      }
      const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
      if (!projectId) {
          handleRegistrationError('Project ID not found');
      }
      try {
          const pushTokenString = (
              await Notifications.getExpoPushTokenAsync({
                  projectId,
              })
          ).data;
          return pushTokenString;
      } catch (e: unknown) {
          handleRegistrationError(`${e}`);
      }
  } else {
      handleRegistrationError('Must use physical device for push notifications');
  }
}