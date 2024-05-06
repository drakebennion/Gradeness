import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { Text } from '../Typography';
import { Button } from '../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { Colors } from "../Constants";

export const ActivityScreenBottomSheet = ({ db, user, activityId, activity, setShouldRefetch, sheetRef }) => {

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
        body: `You have a due date coming up for ${ activity.name }`,
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
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size='s' color='background'>Add due date</Text>
                <IconButton icon='close' onPress={() => sheetRef.current?.close()} style={{ marginRight: -8 }} />
            </View>
            <Text color='background' size='xs' style={{ marginBottom: 12 }}>Please provide a due date for this activity.</Text>
            <View style={{ borderColor: Colors.background, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text color='background' style={{ marginTop: 8, marginLeft: 8 }}>{date?.toLocaleDateString()}</Text>
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
        </>
    )
}