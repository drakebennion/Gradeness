import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RoadmapScreen } from '../Roadmap/RoadmapScreen'
import { GradeLevelScreen } from '../Roadmap/GradeLevelScreen'
import { ActivityScreen } from '../Roadmap/ActivityScreen'
import { CreateUpdateActivityScreen } from '../Roadmap/CreateUpdateActivityScreen'
import { type UserStackParamList } from './userStackParams'

const Stack = createNativeStackNavigator<UserStackParamList>()

export default function UserStack () {
  return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Group>
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
                </Stack.Group>
                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                    <Stack.Screen
                        name="CreateUpdateActivity"
                        component={CreateUpdateActivityScreen}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
  )
}
