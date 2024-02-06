import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBar, Button, Icon, IconButton, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'
import { styles as globalStyles } from "../styles";
import { Colors } from '../Colors';
import { useCallback, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getColorForYear, getGradeLevelNameForYear, getGradeLevelObjectiveForYear } from '../utils/style';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserStackParamList } from '../navigation/userStackParams';
import { groupBy, toSorted } from '../utils/array';
import { Activity } from '../types/Activity';

type Props = NativeStackScreenProps<UserStackParamList, 'GradeLevel'>;
export const GradeLevelScreen = ({ navigation, route }: Props) => {
  const { year } = route.params;
  const db = getFirestore();
  const { user } = useAuthentication();
  const [activities, setActivities] = useState({});
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [progress, setProgress] = useState(0.0);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
            if (user) {
              const q = query(collection(db, "activities"), 
                where("userId", "==", user.uid),
                where("year", "==", year));
              const activities = await getDocs(q);
              const activitiesData = activities.docs.map(doc => ({id: doc.id, ...doc.data() }));
              const activitiesBySemester = groupBy(activitiesData, 'semester');
              // todo: need handling for if there are no activities at all, plus network error handling
              setProgress(activitiesData.filter(activityData => activityData.complete).length / activitiesData.length);
              setActivities(activitiesBySemester);
              setLoadingActivities(false);
            }
          }
      
          fetchData().catch(console.error);
    }, [user])
  );

    return (
      <View>
        <AppBar 
          contentContainerStyle={globalStyles.appBar}
          centerTitle
          title={getGradeLevelNameForYear(year)}
          color="#1C222E"
          titleStyle={{color: getColorForYear(year)}}
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
                <Text style={{color: '#fff'}}>{getGradeLevelObjectiveForYear(year)}</Text>
            </View>
            <View style={styles.progressContainer}>
                <Text style={{ fontWeight: '400', marginBottom: 8, color: '#fff' }}>Progress</Text>
                <Progress.Bar borderColor='#eee' unfilledColor='#eee' width={ null } progress={progress} />
            </View>
            <View>
                <Button 
                  title="Add activity" 
                  color={Colors.highlight2} 
                  tintColor={Colors.background} 
                  onPress={() => navigation.navigate('CreateUpdateActivity')}
                />
            </View>
          </View>
          <View>
            {/* todo: you know a better way to switch these displays without nested ternary's
              .......but do it later lololololol
            */}
              { loadingActivities ? <Text>Loading...</Text> : 
                hasActivities(activities) ? <ActivityList activities={activities} navigation={navigation} /> : <Text>No activities - create some! or refresh</Text>
              }
          </View>
        </ScrollView>
      </View>
    )
  };

  //hmm something about either this or something else errored out -- need to revisit what to do
  // when a user is first created. Maybe not even give them options to do things until
  // activities are created for them? hmm
  const hasActivities = (activities) => activities && (activities['Fall']?.length || activities['Spring']?.length || activities['Summer']?.length);

  const ActivityList = ({ activities, navigation }) => {
    return (
    <>
      {
        ["Fall", "Spring", "Summer"]
          .map(semester => {
            return (
              <View key={semester}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{ semester }</Text>
                { toSorted(activities[semester], (a: Activity, b: Activity) => Number.parseInt(a.defaultActivityId) - Number.parseInt(b.defaultActivityId))
                  .map(({ id, objective, complete, year }) =>   
                  <GradeLevelListItem 
                    key={objective}
                    title={objective}
                    checked={complete}
                    onPress={() => {
                      navigation.navigate('Activity', { activityId: id })
                    }}
                  />) }
              </View>
            );
          })
      }
    </>
    );
  }

  const GradeLevelListItem = ({ title, checked, onPress, }) => {
    return (
        <ListItem
          key={title}
          title={title}
          onPress={onPress}
          leading={<Icon size={24} name={ checked ? "checkbox-marked-circle" : "checkbox-blank-circle-outline" } color="#365a75"/>}
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

    activitiesHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    }
  });