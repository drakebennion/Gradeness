import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBar, Button, Icon, IconButton, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'
import { styles as globalStyles } from "../styles";
import { getColorForYear } from './RoadmapScreen';
import { Colors } from '../Colors';
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useAuthentication } from '../utils/hooks/useAuthentication';

// seems Object.groupBy not available in my current version oops
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

// I gotta get my version shit figured out lols
var toSorted = function(xs, fn) {
  xs.sort(fn);
  return xs;
}

export const GradeLevelScreen = ({ navigation, route }) => {
  const { year } = route.params;
  const db = getFirestore();
  const { user } = useAuthentication();
  const [tasks, setTasks] = useState({});
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const q = query(collection(db, "tasks"), 
          where("userId", "==", user.uid),
          where("year", "==", year));
        const tasks = await getDocs(q);
        const tasksData = tasks.docs.map(doc => doc.data());
        const tasksBySemester = groupBy(tasksData, 'semester');
        setTasks(tasksBySemester);
        setLoadingTasks(false);
      }
    }

    fetchData().catch(console.error);
  }, [user]);

    return loadingTasks ? <Text>Loading</Text> :
      <View>
        <AppBar 
          contentContainerStyle={globalStyles.appBar}
          centerTitle
          title="Freshman"
          color="#1C222E"
          titleStyle={{color: getColorForYear(9)}}
          leading={props => (
            <IconButton 
              onPress={() => navigation.pop()}
              icon={<Icon name="arrow-left" {...props} />}
            />
          )}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ backgroundColor: '#1C222E', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
            <View>
                <Text style={{color: '#fff'}}>Begin your story</Text>
            </View>
            <View style={styles.progressContainer}>
                <Text style={{ fontWeight: '400', marginBottom: 8, color: '#fff' }}>Progress</Text>
                <Progress.Bar borderColor='#eee' unfilledColor='#eee' width={ null }/>
            </View>
            <View>
                <Button title="Add task" color={Colors.highlight2} tintColor={Colors.background} />
            </View>
          </View>
          <View>
              {
                ["Fall", "Spring", "Summer"]
                  .map(semester => {
                    return (
                      <View key={semester}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{ semester }</Text>
                        { toSorted(tasks[semester], (a, b) => Number.parseInt(a.defaultTaskId) - Number.parseInt(b.defaultTaskId))
                          .map(({ displayName }) =>   
                          <GradeLevelListItem 
                            key={displayName}
                            title={displayName}
                            onPress={() => {
                              navigation.navigate('Task', { semester, displayName })
                            }}
                          />) }
                      </View>
                    );
                  })
              }
          </View>
        </ScrollView>
      </View>
  };

  const GradeLevelListItem = ({ title, onPress }) => {
    return (
        <ListItem
          key={title}
          title={title}
          onPress={onPress}
          leading={<Icon size={24} name="checkbox-blank-circle-outline" color="#365a75"/>}
          trailing={<Icon size={24} name="chevron-right" color="#365a75"/>}
        />
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: 128,
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