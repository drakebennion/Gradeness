import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { AppBar, Button, Icon, IconButton, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'
import { styles as globalStyles } from '../styles'
import { Colors, GradeLevels } from "../Constants"
import { useCallback, useState } from 'react'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { getColorForYear, getGradeLevelNameForYear, getGradeLevelObjectiveForYear } from '../utils/style'
import { useFocusEffect } from '@react-navigation/native'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { groupBy, toSorted } from '../utils/array'
import { type Activity } from '../types/Activity'

type Props = NativeStackScreenProps<RoadmapStackParamList, 'GradeLevel'>
export const GradeLevelScreen = ({ navigation, route }: Props) => {
  const { year } = route.params
  const db = getFirestore()
  const { user } = useAuthentication()
  const [activities, setActivities] = useState({})
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [progress, setProgress] = useState(0.0)

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (user) {
          const q = query(collection(db, 'activities'),
            where('userId', '==', user.uid),
            where('year', '==', year))
          const activities = await getDocs(q)
          // todo: still handle firestore typing!
          const activitiesData = activities.docs.map(doc => ({ id: doc.id, complete: doc.data().complete, ...doc.data() }))
          const activitiesBySemester = groupBy(activitiesData, 'semester')
          // todo: need handling for if there are no activities at all, plus network error handling
          setProgress(activitiesData.filter(activityData => activityData.complete).length / activitiesData.length)
          setActivities(activitiesBySemester)
          setLoadingActivities(false)
        }
      }

      fetchData().catch(console.error)
    }, [user])
  )

  const gradeLevel = GradeLevels.find(gradeLevel => gradeLevel.year === year);

  return (
    <View>
      <View style={{ marginTop: 32, display: 'flex', flexDirection: 'row' }}>
        <IconButton
          onPress={() => { navigation.pop() }}
          icon={<Icon size={16} color='white' name="arrow-left" />}
        />
        <Text style={{ color: getColorForYear(year), fontSize: 24, marginTop: 8 }}>
          {gradeLevel.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ backgroundColor: '#1C222E', padding: 16, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
          <View>
            <Text style={{ color: '#fff' }}>{gradeLevel.objective}</Text>
            <Text style={{ color: '#fff' }}>{gradeLevel.details}</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={{ fontWeight: '400', marginBottom: 8, color: '#fff' }}>Progress</Text>
            <Progress.Bar borderColor='#eee' unfilledColor='#eee' width={null} progress={progress} />
          </View>
          <View>
            <Button
              style={{ alignSelf: 'flex-end', marginBottom: 16, marginRight: 16 }}
              title="Add activity"
              color={Colors.highlight2}
              tintColor={Colors.background}
              onPress={() => { navigation.navigate('CreateUpdateActivity') }}
            />
          </View>
        </View>
        <View>
          {/* todo: you know a better way to switch these displays without nested ternary's
              .......but do it later lololololol
            */}
          {loadingActivities
            ? <Text>Loading...</Text>
            : hasActivities(activities) ? <ActivityList activities={activities} navigation={navigation} /> : <Text>No activities - create some! or refresh</Text>
          }
        </View>
      </ScrollView>
    </View>
  )
}

// hmm something about either this or something else errored out -- need to revisit what to do
// when a user is first created. Maybe not even give them options to do things until
// activities are created for them? hmm
const hasActivities = (activities) => activities && (activities.Fall?.length || activities.Spring?.length || activities.Summer?.length)

const ActivityList = ({ activities, navigation }) => {
  return (
    <>
      {
        ['Fall', 'Spring', 'Summer']
          .map(semester => {
            return (
              <View key={semester}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{semester}</Text>
                {toSorted(activities[semester], (a: Activity, b: Activity) => a.order - b.order)
                  .map(({ id, name, complete, year }) =>
                    <GradeLevelListItem
                      key={name}
                      title={name}
                      checked={complete}
                      onPress={() => {
                        navigation.navigate('Activity', { activityId: id })
                      }}
                    />)}
              </View>
            )
          })
      }
    </>
  )
}

const GradeLevelListItem = ({ title, checked, onPress }) => {
  return (
    <ListItem
      key={title}
      title={title}
      onPress={onPress}
      leading={<Icon size={24} name={checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} color="#365a75" />}
      trailing={<Icon size={24} name="chevron-right" color="#365a75" />}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 128
  },

  progressContainer: {
    marginVertical: 16
  },

  activitiesHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  }
})
