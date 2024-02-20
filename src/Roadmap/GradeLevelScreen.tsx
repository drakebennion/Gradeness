import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, IconButton, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'
import { Colors, GradeLevels, semesters } from "../Constants"
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
  const highlightColor = getColorForYear(year);

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
    <View style={{ marginVertical: Dimensions.get('window').height / 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 16 }}>
        <IconButton
          onPress={() => { navigation.pop() }}
          icon={<Icon size={24} color='white' name="arrow-left" />}
        />
        <Text style={{ fontFamily: 'Roboto_400Regular', color: getColorForYear(year), fontSize: 28, marginTop: 8 }}>
          {gradeLevel.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ backgroundColor: Colors.background, padding: 16, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, color: Colors.text, marginBottom: 8 }}>{gradeLevel.objective}</Text>
            <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, lineHeight: 20, letterSpacing: 0.25 }}>{gradeLevel.details}</Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={{ fontFamily: 'Roboto_400Regular', fontWeight: '400', marginBottom: 8, color: Colors.text }}>Progress</Text>
            <Progress.Bar color={highlightColor} borderColor={Colors.background} unfilledColor='#E6E0E9' width={null} progress={progress} />
          </View>
          <View>
            <Button
              style={{ alignSelf: 'flex-end', marginBottom: 16, marginRight: 16 }}
              title="Add activity"
              color={highlightColor}
              tintColor={Colors.background}
              onPress={() => { navigation.navigate('CreateUpdateActivity') }}
            />
          </View>
        </View>
        <View>
          {loadingActivities
            ? <Progress.Circle size={40} indeterminate={true} color={Colors.background} borderWidth={3} style={{ alignSelf: 'center', marginTop: 32 }} />
            : hasActivities(activities) ? <ActivityList activities={activities} navigation={navigation} highlightColor={Colors.highlight2} /> : <Text style={{ fontFamily: 'Roboto_400Regular' }}>No activities - create some! or refresh</Text>
          }
        </View>
      </ScrollView>
    </View>
  )
}

const hasActivities = (activities) => activities && (activities.Fall?.length || activities.Spring?.length || activities.Summer?.length)

const ActivityList = ({ activities, navigation, highlightColor }) => {
  const activitySort = (a: Activity, b: Activity) => {
    if ((a.testActivityId && b.testActivityId) || (!a.testActivityId && !b.testActivityId)) {
      return a.order - b.order;
    } else if (a.testActivityId) {
      return 1;
    } else {
      return -1;
    }
  }
  return (
    <>
      {
        semesters
          .map(semester => {
            return (
              <View key={semester} style={{ marginTop: 16, marginHorizontal: 16 }} >
                <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, fontWeight: '500', marginBottom: 8 }}>{semester}</Text>
                {toSorted(activities[semester], activitySort)
                  .map(({ id, name, complete }) =>
                    <GradeLevelListItem
                      key={name}
                      title={name}
                      checked={complete}
                      highlightColor={highlightColor}
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

const GradeLevelListItem = ({ title, checked, onPress, highlightColor }) => {
  return (
    // todo: get rid this / anythnig react-native-material lol
    <ListItem
      key={title}
      title={title}
      onPress={onPress}
      leadingMode='icon'
      leading={<Icon size={24} name={checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} color={highlightColor} />}
      trailing={< Icon size={24} name="chevron-right" color="#365a75" />}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.text,
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
