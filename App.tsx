import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import './firebaseConfig';
import RootNavigation from './src/navigation';
import { useFonts, Roboto_400Regular } from "@expo-google-fonts/roboto";

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
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
