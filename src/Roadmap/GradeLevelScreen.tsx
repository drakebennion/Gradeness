import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import { Colors, GradeLevels, fontSizes, semesters } from '../Constants';
import { type RoadmapStackParamList } from '../navigation/userStackParams';
import { type Activity } from '../types/Activity';
import { groupBy, toSorted } from '../utils/array';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getColorForYear } from '../utils/style';

import { Text } from '../Typography';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RoadmapStackParamList, 'GradeLevel'>;
export const GradeLevelScreen = ({ navigation, route }: Props) => {
  const { year } = route.params;
  const db = getFirestore();
  const { user } = useAuthentication();
  const [activities, setActivities] = useState({});
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [progress, setProgress] = useState(0.0);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const highlightColor = getColorForYear(year);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (user && shouldRefetch) {
          const q = query(
            collection(db, 'activities'),
            where('userId', '==', user.uid),
            where('year', '==', year),
          );
          const activities = await getDocs(q);
          // todo: still handle firestore typing!
          const activitiesData = activities.docs.map(doc => ({
            id: doc.id,
            complete: doc.data().complete,
            ...doc.data(),
          }));
          const activitiesBySemester = groupBy(activitiesData, 'semester');
          const numberOfCompletedActivities =
            activitiesData.filter(activityData => activityData.complete)
              .length ?? 0;
          const totalCountOfActivities = activitiesData.length || 1;
          // todo: need handling for if there are no activities at all, plus network error handling
          setProgress(numberOfCompletedActivities / totalCountOfActivities);
          setActivities(activitiesBySemester);
          setLoadingActivities(false);
          setShouldRefetch(false);
        }
      };

      fetchData().catch(console.error);
    }, [user, shouldRefetch]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShouldRefetch(true);
    });

    return unsubscribe;
  });

  const toggleActivityComplete = async (
    activityId: string,
    complete: boolean,
  ) => {
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, { complete: !complete });
  };

  const gradeLevel = GradeLevels.find(gradeLevel => gradeLevel.year === year);

  return (
    <View style={{ marginTop: Dimensions.get('window').height / 10 }}>
      <View
        style={{ display: 'flex', flexDirection: 'row', paddingBottom: 16 }}>
        <IconButton
          onPress={() => {
            navigation.pop();
          }}
          icon="arrow-left"
          iconColor={Colors.text}
        />
        <Text
          style={{
            color: getColorForYear(year),
            fontSize: fontSizes.l,
            marginTop: 8,
          }}>
          {gradeLevel.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            backgroundColor: Colors.background,
            padding: 16,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 8 }}>{gradeLevel.objective}</Text>
            <Text size="xs" style={{ lineHeight: 20, letterSpacing: 0.25 }}>
              {gradeLevel.details}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={{ marginBottom: 8 }}>Progress</Text>
            <Progress.Bar
              color={highlightColor}
              borderColor={Colors.background}
              unfilledColor="#E6E0E9"
              width={null}
              progress={progress}
            />
          </View>
          <View>
            <Button
              style={{ alignSelf: 'flex-end', marginVertical: 16 }}
              type="primary"
              onPress={() => {
                navigation.navigate('CreateUpdateActivity');
              }}>
              Add activity
            </Button>
          </View>
        </View>
        <View>
          {loadingActivities ? (
            <Progress.Circle
              size={40}
              indeterminate
              color={Colors.background}
              borderWidth={3}
              style={{ alignSelf: 'center', marginTop: 32 }}
            />
          ) : hasActivities(activities) ? (
            <ActivityList
              activities={activities}
              setShouldRefetch={setShouldRefetch}
              toggleComplete={toggleActivityComplete}
              navigation={navigation}
              highlightColor={Colors.highlight2}
            />
          ) : (
            <EmptyActivityList setShouldRefetch={setShouldRefetch} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const EmptyActivityList = ({ setShouldRefetch }) => {
  return (
    <View style={{ marginTop: 16, marginHorizontal: 32 }}>
      <Text color="background">
        Oops! Looks like our data decided to play hooky today!
      </Text>
      <Text
        color="background"
        weight="light"
        size="xs"
        style={{ marginTop: 48 }}>
        Lets try to get that data to class by clicking the refresh button below
      </Text>
      <Button
        type="secondary"
        mode="outlined"
        style={{ marginTop: 16 }}
        onPress={() => {
          setShouldRefetch(true);
        }}>
        Refresh
      </Button>
    </View>
  );
};

const hasActivities = activities =>
  activities &&
  (activities.Fall?.length ||
    activities.Spring?.length ||
    activities.Summer?.length);

const ActivityList = ({
  activities,
  toggleComplete,
  setShouldRefetch,
  navigation,
  highlightColor,
}) => {
  const activitySort = (a: Activity, b: Activity) => {
    if (
      (a.testActivityId && b.testActivityId) ||
      (!a.testActivityId && !b.testActivityId)
    ) {
      return a.order - b.order;
    } else if (a.testActivityId) {
      return 1;
    } else {
      return -1;
    }
  };
  return (
    <>
      {semesters.map(semester => {
        return (
          <View key={semester} style={{ marginTop: 16, marginHorizontal: 24 }}>
            <Text
              color="background"
              weight="medium"
              style={{ marginBottom: 8 }}>
              {semester}
            </Text>
            {toSorted(activities[semester], activitySort).map(
              ({ id, name, complete, dueDate }) => (
                <GradeLevelListItem
                  key={name + complete}
                  title={name}
                  checked={complete}
                  highlightColor={highlightColor}
                  toggleComplete={() => toggleComplete(id, complete)}
                  setShouldRefetch={setShouldRefetch}
                  onPress={() => {
                    navigation.navigate('Activity', { activityId: id });
                  }}
                  dueDate={dueDate}
                />
              ),
            )}
          </View>
        );
      })}
    </>
  );
};

const GradeLevelListItem = ({
  title,
  toggleComplete,
  setShouldRefetch,
  checked,
  onPress,
  highlightColor,
  dueDate,
}) => {
  const [iconName, setIconName] = useState(
    checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline',
  );

  const onCompletionIconPressed = async e => {
    e.preventDefault();
    setIconName(
      !checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline',
    );
    await toggleComplete();
    setShouldRefetch(true);
  };

  const overdue = !checked && dueDate?.toDate() < new Date();

  return (
    <Pressable
      onPress={onPress}
      style={{ borderBottomColor: '#eee', borderBottomWidth: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 12,
        }}>
        <View
          style={{
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginStart: 16,
          }}>
          <IconButton
            iconColor={highlightColor}
            onPress={onCompletionIconPressed}
            icon={iconName}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <View>
            <Text color="background">{title}</Text>
            <View
              style={{
                marginTop: 12,
                flexDirection: 'row',
              }}>
              <Icon
                source="calendar"
                size={16}
                color={overdue ? Colors.error : Colors.background}
              />
              <Text
                color={overdue ? 'error' : 'background'}
                size="xs"
                style={{ marginLeft: 8, marginTop: -2 }}>
                {dueDate ? dueDate.toDate().toDateString() : 'No date set'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 24,
            height: 24,
            marginEnd: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon size={24} source="chevron-right" color="#365a75" />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.text,
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
    marginBottom: 16,
  },
});
