import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, IconButton, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'
import { Colors, GradeLevels } from "../Constants"
import { useCallback, useState } from 'react'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { getColorForYear } from '../utils/style'
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
          const numberOfCompletedActivities = activitiesData.filter(activityData => activityData.complete).length ?? 0
          const totalCountOfActivities = activitiesData.length || 1;
          // todo: need handling for if there are no activities at all, plus network error handling
          setProgress(numberOfCompletedActivities / totalCountOfActivities)
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
      <View style={{ marginTop: 48, display: 'flex', flexDirection: 'row' }}>
        <IconButton
          onPress={() => { navigation.pop() }}
          icon={<Icon size={24} color='white' name="arrow-left" />}
        />
        <Text style={{ fontFamily: 'Roboto_400Regular', color: getColorForYear(year), fontSize: 24, marginTop: 8 }}>
          {gradeLevel.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ backgroundColor: '#1C222E', padding: 16, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
          <View>
            <Text style={{ fontFamily: 'Roboto_400Regular', color: '#fff' }}>{gradeLevel.objective}</Text>
            <Text style={{ fontFamily: 'Roboto_400Regular', color: '#fff' }}>{gradeLevel.details}</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={{ fontFamily: 'Roboto_400Regular', fontWeight: '400', marginBottom: 8, color: '#fff' }}>Progress</Text>
            <Progress.Bar color={Colors.highlight2} borderColor={Colors.background} unfilledColor='#E6E0E9' width={null} progress={progress} />
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
          {loadingActivities
            ? <Text style={{ fontFamily: 'Roboto_400Regular' }}>Loading...</Text>
            : hasActivities(activities) ? <ActivityList activities={activities} navigation={navigation} /> : <Text style={{ fontFamily: 'Roboto_400Regular' }}>No activities - create some! or refresh</Text>
          }
        </View>
      </ScrollView>
    </View>
  )
}

const hasActivities = (activities) => activities && (activities.Fall?.length || activities.Spring?.length || activities.Summer?.length)

const ActivityList = ({ activities, navigation }) => {
  return (
    <>
      {
        ['Fall', 'Spring', 'Summer']
          .map(semester => {
            return (
              <View key={semester}>
                <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, fontWeight: '500' }}>{semester}</Text>
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
      leading={<Icon size={24} name={checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} color={Colors.highlight2} />}
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
