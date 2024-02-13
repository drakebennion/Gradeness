import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
    return null;
  }

  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <RootNavigation />
    </IconComponentProvider>
  );
}
