import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoadmapScreen } from '../Roadmap/RoadmapScreen';
import { GradeLevelScreen } from '../Roadmap/GradeLevelScreen';
import { TaskScreen } from '../Roadmap/TaskScreen';

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
                    name="Task"
                    component={TaskScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}