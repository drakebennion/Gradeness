import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RoadmapScreen } from '../Roadmap/RoadmapScreen'
import { GradeLevelScreen } from '../Roadmap/GradeLevelScreen'
import { ActivityScreen } from '../Roadmap/ActivityScreen'
import { CreateUpdateActivityScreen } from '../Roadmap/CreateUpdateActivityScreen'
import { type RoadmapStackParamList } from './userStackParams'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AccomplishmentScreen } from '../Accomplishment/AccomplishmentScreen'
import { Colors, fontSizes } from '../Constants'
import { Icon } from '@react-native-material/core'
import { Dimensions, Platform } from 'react-native'
import Toast, { BaseToast } from 'react-native-toast-message'
import { Drawer } from 'react-native-drawer-layout'
import { useState } from 'react'
import { RoadmapDialogContext, RoadmapDrawerContext } from '../Contexts'
import { DrawerContent } from '../Roadmap/DrawerContent'

const Stack = createNativeStackNavigator<RoadmapStackParamList>()
const Tab = createBottomTabNavigator()

function RoadmapTabs() {
    const windowHeight = Dimensions.get('window').height;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.highlight2,
                tabBarInactiveTintColor: Colors.text,
                tabBarActiveBackgroundColor: Colors.background,
                tabBarInactiveBackgroundColor: Colors.background,
                tabBarStyle: { backgroundColor: Colors.background, borderTopWidth: 0, height: windowHeight / 9, },
                tabBarLabelStyle: { marginBottom: 12, marginTop: -8 },
                tabBarHideOnKeyboard: Platform.OS !== 'ios',
                tabBarIcon: ({ color }) => {
                    let iconName = route.name === 'Roadmap' ? 'map-outline' : 'checkbox-marked-circle-outline';
                    return <Icon size={32} name={iconName} color={color} />;
                },

            })}
        >
            {/* <Tab.Screen name="Home" component={Home} /> */}
            <Tab.Screen name="Roadmap" component={RoadmapScreen} />
            <Tab.Screen name="Accomplishment" component={AccomplishmentScreen} />
            {/* <Tab.Screen name="Goals" component={Goals} /> */}
        </Tab.Navigator >
    )
}

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.background,
    },
};

const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#000', backgroundColor: '#000' }}
            text1Style={{ color: Colors.text, fontFamily: 'Roboto_400Regular', fontSize: fontSizes.xs }}
            text2Style={{ fontFamily: 'Roboto_300Light', fontSize: fontSizes.xs }}
        />
    )
}

export default function UserStack() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <RoadmapDialogContext.Provider value={{ dialogOpen, setDialogOpen }}>
            <RoadmapDrawerContext.Provider value={{ drawerOpen, setDrawerOpen }}>
                <Drawer
                    open={drawerOpen}
                    onOpen={() => setDrawerOpen(true)}
                    onClose={() => setDrawerOpen(false)}
                    renderDrawerContent={DrawerContent}
                    drawerType='front'
                    drawerStyle={{ backgroundColor: '#E9ECF2', width: '90%', borderRadius: 16 }}
                    hideStatusBarOnOpen={false}
                >
                    <NavigationContainer theme={Theme}>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Group>
                                <Stack.Screen
                                    name="RoadmapTabs"
                                    component={RoadmapTabs}
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
                </Drawer>
            </RoadmapDrawerContext.Provider>
            <Toast config={toastConfig} />
        </RoadmapDialogContext.Provider>
    )
}