import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import './firebaseConfig';
import RootNavigation from './src/navigation';

export default function App() {

  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <RootNavigation />
    </IconComponentProvider>
  );
}
