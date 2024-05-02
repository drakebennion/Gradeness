import { Divider, Icon, IconButton } from 'react-native-paper'
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Colors } from "../Constants"
import { useFocusEffect } from '@react-navigation/native'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { getGradeLevelNameForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type Activity } from '../types/Activity'
import * as Progress from 'react-native-progress'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import Toast from 'react-native-toast-message'
import { useHeaderHeight } from '@react-navigation/elements'

import { Text } from '../Typography'
import { TextInput } from '../components/TextInput'
import { Button } from '../components/Button'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { RoadmapStackParamList } from '../navigation/userStackParams'

type Props = NativeStackScreenProps<RoadmapStackParamList, 'Activity'>
export const ActivityScreen = ({ navigation, route }: Props) => {
  const db = getFirestore()
  const { user } = useAuthentication()
  const { activityId } = route.params
  const [activity, setActivity] = useState<Activity | undefined>()
  const [accomplishment, setAccomplishment] = useState({ id: null, content: {} });
  const [addAccomplishment, setAddAccomplishment] = useState('')
  const [loadingActivity, setLoadingActivity] = useState(true)
  const storage = getStorage()
  const [imgUri, setImgUri] = useState({ uri: '' })
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const headerHeight = useHeaderHeight();

  const toggleComplete = async () => {
    const activityRef = doc(db, 'activities', activityId)
    await updateDoc(activityRef, { complete: !activity.complete })
  }

  const saveAccomplishment = async () => {
    const accomplishmentRef = doc(db, 'accomplishments', accomplishment.id)

    const accomplishmentsForYear = accomplishment.content[activity.year]
    const accomplishmentEntity = {
      content: {
        ...accomplishment.content,
        // todo: only add newline if this isn't the first accomplishment being added!
        [activity.year]: `${accomplishmentsForYear + '\n' + addAccomplishment}`
      },
      updatedAt: Date.now(),
      updatedBy: user.uid
    }
    await setDoc(accomplishmentRef, accomplishmentEntity, { merge: true }).catch(console.error)
  }

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (activityId && user && shouldRefetch) {
          const activity = await getDoc(doc(db, 'activities', activityId))
          // todo: need handling for if there are no activities at all, plus network error handling
          // todo: mapper for firestore data to Activity
          const activityData = activity.data()
          setActivity(activityData)

          // load image, if fails fallback
          const imgRef = ref(storage, `/${activityData.year}-${activityData.semester}-${activityData.order}.jpg`)
          const uri = await getDownloadURL(imgRef)
            .catch(() => console.log("could not download image"))
          if (uri) {
            setImgUri({ uri })
          }

          setLoadingActivity(false)

          const q = query(collection(db, 'accomplishments'),
            where('userId', '==', user.uid))
          const accomplishment = await getDocs(q);
          const accomplishmentData = accomplishment.docs.map(doc => ({ id: doc.id, content: doc.data().content, ...doc.data() }))

          setAccomplishment(accomplishmentData[0])
          setShouldRefetch(false)
        }
      }

      fetchData().catch(console.error)
    }, [activityId, user, shouldRefetch])
  )

  // todo: pull all this into its own component? for bottomsheet and datepicker
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [1, "30%"], []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    []
  );

  const [date, setDate] = useState(activity?.dueDate?.toDate() ?? new Date());
  const [show, setShow] = useState(false);
  const onChange = (_event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const updateActivityWithDatabase = async (notificationId: string) => {
    const activityRef = doc(db, 'activities', activityId)
    const activityEntity = {
      ...activity,
      dueDate: date,
      notificationId,
      updatedAt: Date.now(),
      updatedBy: user.uid
    }
    await setDoc(activityRef, activityEntity, { merge: true }).catch(console.error)
  }

  const saveActivityDueDate = async () => {
    if (activity?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(activity.notificationId);
    }

    const scheduledNotificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Activity reminder',
        body: `You have a due date coming up for [${ activity.name }]`,
        data: {
          url: `gradeness://activity/${activityId}`,
        }
      }, 
      trigger: date.setHours(0, 0, 0, 0) <= (new Date()).setHours(0, 0, 0, 0) ? 
      null : date.setHours(12),
      // todo: set icon for notification
    });
    await updateActivityWithDatabase(scheduledNotificationId);
    setShouldRefetch(true);
  }

  return (
    loadingActivity
      ? <Progress.Circle size={40} indeterminate={true} color={Colors.highlight2} borderWidth={3} style={{ alignSelf: 'center', marginTop: '66%' }} />
      :
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={{ marginVertical: Dimensions.get('window').height / 10 }}>
          <View style={{ marginBottom: 16 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <IconButton
                onPress={() => { navigation.pop() }}
                iconColor={Colors.text}
                icon='arrow-left'
              />
              {!!activity.testActivityId ? <></> :
                <IconButton
                  onPress={() => { navigation.navigate('CreateUpdateActivity', { activity: { activityId, name: activity.name, semester: activity.semester, year: activity.year, description: activity.description } }) }}
                  iconColor={Colors.text}
                  icon='square-edit-outline'
                />
              }
            </View>
            <Text size='m' style={{ marginTop: 8, marginLeft: 16, marginRight: 8 }}>
              {activity.name}
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.container}>
            <View>
              <ImageBackground source={imgUri.uri ? imgUri : require('../../assets/activities/orientation.png')} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 12, height: 160 }}>
                {/* todo: pull this into a Badge component */}
                <View style={{ backgroundColor: Colors.text, padding: 8, borderRadius: 8, margin: 8, alignSelf: 'flex-end' }}>
                  <Text color='background'>{activity.semester}</Text>
                </View>
                <View style={{ backgroundColor: Colors.text, padding: 8, borderRadius: 8, margin: 8, alignSelf: 'flex-end' }}>
                  <Text color='background'>{getGradeLevelNameForYear(activity.year)}</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
              {/* todo: fix spacing/make look better lol */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Icon size={24} source='calendar' />
                <View>
                  <Text color='background'>Due Date</Text>
                  {/* todo: wire this to existing activity due date */}
                  <Text color='background'>{activity.dueDate ? activity.dueDate.toDate().toDateString() : 'No date set. Set a due date.'} </Text>
                  {/* <Text color='background'>{(new Date()).toLocaleDateString()} </Text> */}
                </View>
                <IconButton icon='pencil-outline' onPress={() => handleSnapPress(1)} />
              </View>
              <Divider style={{ marginBottom: 12 }} />
              {/* todo: could def handle this better - if no overview show nothing, if overview is string display it, otherwise show header and items */}
              {typeof activity.overview === "string" ?
                <Text color='background' style={{ marginBottom: 12 }}>{activity.overview}</Text> :

                activity.overview ?
                  <View style={{ marginBottom: 16 }}>
                    <Text color='background' style={{ marginBottom: 12 }}>{activity.overview.header}</Text>
                    {
                      activity.overview.items.map(item =>
                        <Text color='background' key={item} style={{ marginLeft: 16 }}>{`\u2022 ${item}`}</Text>
                      )
                    }
                  </View> : <></>
              }
              <Button
                type={activity.complete ? 'secondary' : 'primary'}
                icon={activity.complete ? 'check' : ''}
                onPress={async () => { await toggleComplete().then(() => { setShouldRefetch(true) }) }}
                style={{ marginBottom: 24 }}
              >
                <Text color='background' size='xs' weight={activity.complete ? 'regular' : 'medium'}>
                  {activity.complete ? 'Complete' : 'Mark complete'}
                </Text>
              </Button>

              <View style={{ marginBottom: 24 }}>
                <Text color='background' style={{ marginTop: 16 }}>Capture your accomplishments</Text>
                <TextInput
                  label="Accomplishments"
                  multiline
                  value={addAccomplishment}
                  onChangeText={(content) => {
                    setAddAccomplishment(content)
                  }}
                  style={{ marginTop: 16, }}
                />
                <Button
                  disabled={!addAccomplishment}
                  type='tertiary'
                  style={{ alignSelf: 'flex-end', marginTop: 16 }}
                  onPress={
                    () => saveAccomplishment()
                      .then(() => setAddAccomplishment(''))
                      .then(() => Toast.show({ type: 'success', text1: 'Accomplishment saved', position: 'bottom', swipeable: true }))
                  }>
                  Save
                </Button>
              </View>

              {
                typeof activity.description === "string" ?
                  <Text color='background'>{activity.description}</Text>
                  :
                  <View>
                    <Text color='background' style={{ lineHeight: 20 }}>{activity.description.header}</Text>
                    <View style={{ margin: 12 }}>
                      {
                        activity.description.items.map(item => {
                          const headerAndContent = item.split(':');
                          return <View key={item} style={{ marginBottom: 8 }}>
                            <Text color='background' size='xs' weight='medium' style={{ lineHeight: 20 }}>{headerAndContent[0]}:
                              <Text color='background' size='xs' weight='regular' style={{ lineHeight: 20 }}>{headerAndContent[1]}</Text>
                            </Text>

                          </View>
                        }
                        )
                      }
                    </View>
                    <Text color='background' size='xs' style={{ lineHeight: 20 }}>{
                      activity.description.footer
                    }</Text>
                  </View>
              }
            </View>
          </ScrollView>
        </View>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          handleStyle={{ display: 'none' }}
          style={{ borderRadius: 5, paddingHorizontal: 16 }}
          backdropComponent={renderBackdrop}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text color='background'>Add due date</Text>
            <IconButton icon='close' onPress={() => sheetRef.current?.close()} />
          </View>
          <Text color='background'>Please provide a due date for this activity.</Text>
          <View style={{ borderColor: Colors.background, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text color='background'>{date?.toLocaleDateString()}</Text>
            { show && <DateTimePicker
              value={date}
              mode='date'
              minimumDate={new Date()}
              onChange={onChange}
            /> }
            
            <IconButton icon='calendar' onPress={() => {
              if (!date) {
                setDate(new Date());
              }

              setShow(true);
            }} />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button
              type='secondary'
              style={{ marginRight: 8 }}
              onPress={() => { sheetRef.current?.close() }}
            >
              Cancel
            </Button>
            <Button
              type='tertiary'
              onPress={() => saveActivityDueDate().then(() => sheetRef.current?.close())}
            >
              Save
            </Button>
          </View>
        </BottomSheet>
      </KeyboardAvoidingView >
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.text,
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 240,
  }
})
