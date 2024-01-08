import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, IconComponentProvider, ListItem } from '@react-native-material/core'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Your roadmap', 
              headerStyle: {
                backgroundColor: '#365a75'
              },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen 
            name="Profile"
            component={SecondaryScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </IconComponentProvider>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <>  
      <ListItem title="Freshman" secondaryText="Begin your story" trailing={<Icon size={24} name="chevron-right"/>} />
      <ListItem title="Sophomore" secondaryText="Develop your story" trailing={<Icon size={24} name="chevron-right"/>} />
      <ListItem title="Junior" secondaryText="Refine your story" trailing={<Icon size={24} name="chevron-right"/>} />
      <ListItem title="Senior" secondaryText="Tell your story" trailing={<Icon size={24} name="chevron-right"/>} />
    </>
  );
}

const SecondaryScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>Hi { route.params.name }!</Text>
      <Button 
        title="Go home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
