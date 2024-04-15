import 'react-native-gesture-handler';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import './firebaseConfig';
import RootNavigation from './src/navigation';
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium
  });

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
