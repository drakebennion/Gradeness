import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RoadmapScreen } from '../Roadmap/RoadmapScreen'
import { GradeLevelScreen } from '../Roadmap/GradeLevelScreen'
import { ActivityScreen } from '../Roadmap/ActivityScreen'
import { CreateUpdateActivityScreen } from '../Roadmap/CreateUpdateActivityScreen'
import { type RoadmapStackParamList } from './userStackParams'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AccomplishmentScreen } from '../Accomplishment/AccomplishmentScreen'
import { Colors } from '../Constants'
import { Icon } from '@react-native-material/core'
import { Platform } from 'react-native'

const RoadmapStack = createNativeStackNavigator<RoadmapStackParamList>()
const Tab = createBottomTabNavigator()
const AccomplishmentsStack = createNativeStackNavigator()

function Overview() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.highlight2,
                tabBarInactiveTintColor: Colors.text,
                tabBarActiveBackgroundColor: Colors.background,
                tabBarInactiveBackgroundColor: Colors.background,
                tabBarStyle: { borderTopWidth: 0, height: 72 },
                tabBarLabelStyle: { marginBottom: 12 },
                tabBarHideOnKeyboard: Platform.OS !== 'ios',
                tabBarIcon: ({ color }) => {
                    let iconName = route.name === 'Roadmap' ? 'map-outline' : 'checkbox-marked-circle-outline';
                    return <Icon size={32} name={iconName} color={color} />;
                },

            })}
        >
            {/* <Tab.Screen name="Home" component={Home} /> */}
            < Tab.Screen name="Roadmap" component={RoadmapScreens} />
            <Tab.Screen name="Accomplishments" component={AccomplishmentsScreen} />
            {/* <Tab.Screen name="Goals" component={Goals} /> */}
        </Tab.Navigator >
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

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.background,
    },
};

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
        </ RoadmapStack.Navigator>
    )
}

export default function UserStack() {
    return (
        <NavigationContainer theme={Theme}>
            <Overview />
        </NavigationContainer>
    )
}
