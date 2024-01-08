import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen 
          name="Profile"
          component={SecondaryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>  
      <Text>Get ready for Gradeness</Text>
      <Button 
        title="Go to secondary"
        onPress={() => navigation.navigate('Profile', { name: 'Drake' })}
      />
    </View>
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
