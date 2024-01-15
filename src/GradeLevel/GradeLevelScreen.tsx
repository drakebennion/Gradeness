import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'

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
        Spring: [
          "Form relationships with teachers",
          "Set a reading goal for summer",
          "Look for enrichment activities for the summer months",
          "Choose your Sophomore Fall classes",
          "Familiarize yourself with important tests you should take like ACT, SAT, etc",
        ],
        Summer: [
          "Get a job",
          "Volunteer",
          "Get and manage a bank account",
          "Learn to cook and prepare a meal",
          "Learn how to shop for groceries",
        ],
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.gradeHeader}>
            <Image style={{ height: 80, width: 80 }} source={require("../../assets/9th.png")}/>
            <Text>Freshman</Text>
            <Text>Begin your story</Text>
        </View>
        <View style={styles.progressContainer}>
            <Text style={{ fontWeight: '400', marginBottom: 8 }}>Progress</Text>
            <Progress.Bar borderColor='#eee' unfilledColor='#eee' width={ null }/>
        </View>
        <View style={styles.tasksHeader}>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>Tasks</Text>
            <Icon size={24} name="plus-circle" color="#365a75"/>
        </View>
        <View>
            {
              Object.keys(tasks["Freshman"])
                .map(semester => {
                  return (
                    <View key={semester}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>{ semester }</Text>
                      { tasks["Freshman"][semester].map(task => <GradeLevelListItem key={task} title={task} />) }
                    </View>
                  );
                })
            }
        </View>
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
          key={title}
          title={title}
          leading={<Icon size={24} name="checkbox-blank-circle-outline" color="#365a75"/>}
          trailing={<Icon size={24} name="dots-horizontal" color="#365a75"/>}
        />
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      display: 'flex',
      justifyContent: 'space-between',
      marginVertical: 32,
      paddingBottom: 32,
      padding: 8,
      paddingRight: 16,
    },
  
    gradeHeader: {
      display: 'flex',
      flexDirection: 'row',
    },

    progressContainer: {
        marginVertical: 16,
    },

    tasksHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    }
  });