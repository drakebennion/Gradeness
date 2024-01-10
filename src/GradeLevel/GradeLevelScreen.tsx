import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBar, Icon, IconButton, IconComponentProvider, ListItem } from '@react-native-material/core'

const tasks = {
    "Freshman": {
        Fall: [
            "Orientation and familiarization",
            "Connect with upper classmen",
            "Meet with your counselor",
            "Research ways to stay organized ",
            "Develop good attendance habits",
            "Learn how to manage and complete your school work",
            "Take some personality tests to understand your strengths",
            "Evaluate your clothing and appearance ",
            "Understand how grades can impact your life",
            "Explore career options after high school",
            "Understand graduation requirements",
            "Learn how to set goals for yourself",
            "Attend a school sponsored social event",
            "Join a club",
            "Learn how to ask for help",
            "Choose your Freshman Spring class schedule",
        ],
        Spring: [],
        Summer: [],
    },
    "Sophomore": {
        Fall: [],
        Spring: [],
        Summer: [],
    },
    "Junior": {
        Fall: [],
        Spring: [],
        Summer: [],
    },
    "Senior": {
        Fall: [],
        Spring: [],
        Summer: [],
    },
};

export const GradeLevelScreen = ({ navigation, route }) => {
    return (
      <ScrollView style={styles.container}>
        <Text>{ route.params.year }th Grade Freshman - Begin your story</Text>
        <Text>Progress bar here</Text>
        <Text>Tasks and plus button here</Text>
        <Text>Fall</Text>
        { tasks["Freshman"].Fall.map(task => <GradeLevelListItem title={task} />) }
        <Text>Spring</Text>
        <Text>Summer</Text>
        <Button 
          title="Go home"
          onPress={() => navigation.navigate('Roadmap')}
        />
      </ScrollView>
    );
  };

  const GradeLevelListItem = ({ title }) => {
    return (
        <ListItem 
          title={title}
          leading={<Icon size={24} name="checkbox-blank-circle-outline"/>}
          trailing={<Icon size={24} name="dots-horizontal"/>}
        />
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      marginTop: 32,
    },
  
    appBar: { 
      marginTop: 32, 
      marginBottom: 32 
    }
  });