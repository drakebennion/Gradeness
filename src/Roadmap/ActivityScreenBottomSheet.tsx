import * as Notifications from 'expo-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { View } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { Colors } from '../Constants';
import { Text } from '../Typography';
import { Button } from '../components/Button';
import DatePicker from '../components/DatePicker';

export const ActivityScreenBottomSheet = ({
  db,
  user,
  activityId,
  activity,
  setShouldRefetch,
  sheetRef,
}) => {
  const minimumDate = new Date(new Date().setDate(new Date().getDate() + 1));
  const [date, setDate] = useState(activity?.dueDate?.toDate() ?? minimumDate);

  const updateActivityWithDatabase = async (notificationId: string) => {
    const activityRef = doc(db, 'activities', activityId);
    const activityEntity = {
      ...activity,
      dueDate: date,
      notificationId,
      updatedAt: Date.now(),
      updatedBy: user.uid,
    };
    await setDoc(activityRef, activityEntity, { merge: true }).catch(
      console.error,
    );
  };

  const saveActivityDueDate = async () => {
    if (activity?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        activity.notificationId,
      );
    }

    const scheduledNotificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Activity reminder',
          body: `You have a due date coming up for ${activity.name}`,
          data: {
            url: `gradeness://activity/${activityId}`,
          },
        },
        trigger: date.setHours(12),
        // todo: set icon for notification
      });
    await updateActivityWithDatabase(scheduledNotificationId);
    setShouldRefetch(true);
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text size="s" color="background">
          Add due date
        </Text>
        <IconButton
          icon="close"
          onPress={() => sheetRef.current?.close()}
          style={{ marginRight: -8 }}
        />
      </View>
      <Text color="background" size="xs" style={{ marginBottom: 12 }}>
        Please provide a due date for this activity.
      </Text>
      <View
        style={{
          borderColor: Colors.background,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 8,
        }}>
        <DatePicker date={date} setDate={setDate} minimumDate={minimumDate} />
        <View style={{ alignSelf: 'center' }}>
          <Icon source="calendar" size={24} />
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 16,
        }}>
        <Button
          type="secondary"
          style={{ marginRight: 8 }}
          onPress={() => {
            sheetRef.current?.close();
          }}>
          Cancel
        </Button>
        <Button
          type="tertiary"
          onPress={() =>
            saveActivityDueDate().then(() => sheetRef.current?.close())
          }>
          Save
        </Button>
      </View>
    </View>
  );
};
