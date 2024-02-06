import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RoadmapScreen } from '../Roadmap/RoadmapScreen'
import { GradeLevelScreen } from '../Roadmap/GradeLevelScreen'
import { ActivityScreen } from '../Roadmap/ActivityScreen'
import { CreateUpdateActivityScreen } from '../Roadmap/CreateUpdateActivityScreen'
import { type RoadmapStackParamList } from './userStackParams'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AccomplishmentScreen } from '../Accomplishment/AccomplishmentScreen'

const RoadmapStack = createNativeStackNavigator<RoadmapStackParamList>()
const Tab = createBottomTabNavigator()
const AccomplishmentsStack = createNativeStackNavigator()

function Overview() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            {/* <Tab.Screen name="Home" component={Home} /> */}
            <Tab.Screen name="Roadmap" component={RoadmapScreens} />
            <Tab.Screen name="Accomplishments" component={AccomplishmentsScreen} />
            {/* <Tab.Screen name="Goals" component={Goals} /> */}
        </Tab.Navigator>
    )
}

function AccomplishmentsScreen() {
    return (
        <AccomplishmentsStack.Navigator screenOptions={{ headerShown: false }}>
            <AccomplishmentsStack.Screen
                name="AccomplishmentHome"
                component={AccomplishmentScreen}
            />
        </AccomplishmentsStack.Navigator>
    )
}

function RoadmapScreens() {
    return (
        <RoadmapStack.Navigator screenOptions={{ headerShown: false }}>
            <RoadmapStack.Group>
                <RoadmapStack.Screen
                    name="RoadmapHome"
                    component={RoadmapScreen}
                />
                <RoadmapStack.Screen
                    name="GradeLevel"
                    component={GradeLevelScreen}
                />
                <RoadmapStack.Screen
                    name="Activity"
                    component={ActivityScreen}
                />
            </RoadmapStack.Group>
            <RoadmapStack.Group>
                <RoadmapStack.Screen
                    name="CreateUpdateActivity"
                    component={CreateUpdateActivityScreen}
                />
            </RoadmapStack.Group>
        </RoadmapStack.Navigator>
    )
}

export default function UserStack() {
    return (
        <NavigationContainer>
            <Overview />
        </NavigationContainer>
    )
}
