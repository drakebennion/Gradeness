import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppBar, Icon, IconButton, IconComponentProvider, ListItem } from '@react-native-material/core'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
        </Stack.Navigator>
      </NavigationContainer>
    </IconComponentProvider>
  );
}

const RoadmapScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AppBar 
        contentContainerStyle={styles.appBar}
        centerTitle
        title="Your roadmap"
        color="#365a75"
        leading={props => (
          <IconButton icon={props => <Icon name="menu" {...props} />} {...props} />
        )}
      />
      <ListItem 
        title="Freshman" 
        secondaryText="Begin your story" 
        trailing={<Icon size={24} name="chevron-right"/>}
        onPress={() => navigation.navigate('GradeLevel', { year: 9 })}
      />
      <ListItem 
        title="Sophomore" 
        secondaryText="Develop your story" 
        trailing={<Icon size={24} name="chevron-right"/>} 
      />
      <ListItem 
        title="Junior" 
        secondaryText="Refine your story" 
        trailing={<Icon size={24} name="chevron-right"/>} 
      />
      <ListItem 
        title="Senior" 
        secondaryText="Tell your story" 
        trailing={<Icon size={24} name="chevron-right"/>} 
      />
    </View>
  );
}

const GradeLevelScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>{ route.params.year }th Grade</Text>
      <Text>Freshman - Begin your story</Text>
      <Text>Progress bar here</Text>
      <Text>Tasks and plus button here</Text>
      <Text>Fall</Text>
      <ListItem 
        title="Join a club / take up a hobby"
        leading={<Icon size={24} name="checkbox-blank-circle-outline"/>}
        trailing={<Icon size={24} name="dots-horizontal"/>}
      />
      <Text>Spring</Text>
      <Text>Summer</Text>
      <Button 
        title="Go home"
        onPress={() => navigation.navigate('Roadmap')}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },

  appBar: { 
    marginTop: 32, 
    marginBottom: 32 
  }
});
