import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, IconButton, ListItem } from '@react-native-material/core'
import * as Progress from 'react-native-progress'
import { Colors, GradeLevels, fontSizes, semesters } from "../Constants"
import { useCallback, useEffect, useState } from 'react'
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
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
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const highlightColor = getColorForYear(year);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (user && shouldRefetch) {
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
          setShouldRefetch(false)
        }
      }

      fetchData().catch(console.error)
    }, [user, shouldRefetch])
  )

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShouldRefetch(true)
    })

    return unsubscribe
  })

  const toggleActivityComplete = async (activityId: string, complete: boolean) => {
    const activityRef = doc(db, 'activities', activityId)
    await updateDoc(activityRef, { complete: !complete })
  }

  const gradeLevel = GradeLevels.find(gradeLevel => gradeLevel.year === year);

  return (
    <View style={{ marginTop: Dimensions.get('window').height / 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 16 }}>
        <IconButton
          onPress={() => { navigation.pop() }}
          icon={<Icon size={24} color='white' name="arrow-left" />}
        />
        <Text style={{ fontFamily: 'Roboto_400Regular', color: getColorForYear(year), fontSize: fontSizes.l, marginTop: 8 }}>
          {gradeLevel.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ backgroundColor: Colors.background, padding: 16, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s, color: Colors.text, marginBottom: 8 }}>{gradeLevel.objective}</Text>
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
              color={Colors.highlight2}
              tintColor={Colors.background}
              onPress={() => { navigation.navigate('CreateUpdateActivity') }}
            />
          </View>
        </View>
        <View>
          {loadingActivities
            ? <Progress.Circle size={40} indeterminate={true} color={Colors.background} borderWidth={3} style={{ alignSelf: 'center', marginTop: 32 }} />
            : hasActivities(activities) ? <ActivityList activities={activities} setShouldRefetch={setShouldRefetch} toggleComplete={toggleActivityComplete} navigation={navigation} highlightColor={Colors.highlight2} />
              : <EmptyActivityList navigation={navigation} />
          }
        </View>
      </ScrollView>
    </View>
  )
}

const EmptyActivityList = ({ navigation }) => {
  return (
    <View style={{ marginTop: 16, marginHorizontal: 32 }}>
      <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s }}>Oops! Looks like our data decided to play hooky today!</Text>
      <Text style={{ fontFamily: 'Roboto_300Light', fontSize: fontSizes.xs, marginTop: 48 }}>To start again, please navigate to the Roadmap page and then return to this page.</Text>
      <Button
        color={Colors.text} tintColor={Colors.background}
        title="Return to roadmap"
        style={{ marginTop: 16 }}
        onPress={() => { navigation.pop() }}
      />
    </View>
  )
}

const hasActivities = (activities) => activities && (activities.Fall?.length || activities.Spring?.length || activities.Summer?.length)

const ActivityList = ({ activities, toggleComplete, setShouldRefetch, navigation, highlightColor }) => {
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
                <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s, fontWeight: '500', marginBottom: 8 }}>{semester}</Text>
                {toSorted(activities[semester], activitySort)
                  .map(({ id, name, complete }) =>
                    <GradeLevelListItem
                      key={name + complete}
                      title={name}
                      checked={complete}
                      highlightColor={highlightColor}
                      toggleComplete={() => toggleComplete(id, complete)}
                      setShouldRefetch={setShouldRefetch}
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

const GradeLevelListItem = ({ title, toggleComplete, setShouldRefetch, checked, onPress, highlightColor }) => {
  const [iconName, setIconName] = useState(checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline');

  const onCompletionIconPressed = async (e) => {
    e.preventDefault();
    setIconName(!checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline')
    await toggleComplete();
    setShouldRefetch(true);
  }

  return (
    // todo: get rid this / anythnig react-native-material lol
    <ListItem
      key={title}
      title={title}
      onPress={onPress}
      leadingMode='icon'
      leading={<IconButton
        color={highlightColor}
        onPress={onCompletionIconPressed}
        icon={(props) => <Icon name={iconName} color={highlightColor} {...props} />} />}
      trailing={<Icon size={24} name="chevron-right" color="#365a75" />}
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
