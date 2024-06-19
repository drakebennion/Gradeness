import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../Owner/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function OwnerStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OwnerDashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
