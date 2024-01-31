import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoadmapScreen } from '../Roadmap/RoadmapScreen';
import { GradeLevelScreen } from '../Roadmap/GradeLevelScreen';
import { ActivityScreen } from '../Roadmap/ActivityScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
    return (
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
                    name="Activity"
                    component={ActivityScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}