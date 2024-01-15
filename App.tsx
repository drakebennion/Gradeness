import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconComponentProvider } from '@react-native-material/core'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GradeLevelScreen } from './src/GradeLevel/GradeLevelScreen';
import { RoadmapScreen } from './src/Roadmap/RoadmapScreen';
import { TaskScreen } from './src/Task/TaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen 
            name="Roadmap"
            component={RoadmapScreen}
          />
          <Stack.Screen 
            name="GradeLevel"
            component={GradeLevelScreen}
          />
          <Stack.Screen 
            name="Task"
            component={TaskScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </IconComponentProvider>
  );
}
