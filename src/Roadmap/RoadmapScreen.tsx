import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  collection,
  getCountFromServer,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useCallback, useContext, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GradeLevels } from '../Constants';
import { RoadmapDrawerContext } from '../Contexts';
import { Text } from '../Typography';
import { type RoadmapStackParamList } from '../navigation/userStackParams';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getColorForYear } from '../utils/style';
import { DeleteAccountDialog } from './DeleteAccountDialog';

const roadmapGradeLevels = GradeLevels;

type Props = NativeStackScreenProps<RoadmapStackParamList, 'Roadmap'>;
export const RoadmapScreen = ({ navigation }: Props) => {
  const { user } = useAuthentication();
  const db = getFirestore();

  const { setDrawerOpen } = useContext(RoadmapDrawerContext);

  const cardMargin = 16;
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - cardMargin * 3) / 2;
  const cardHeight = cardWidth;

  const RoadmapCard = ({ year, name, objective }) => {
    const [numberOfActivities, setNumberOfActivities] = useState(0);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [numberOfOverdue, setNumberOfOverdue] = useState(0);
    useFocusEffect(
      useCallback(() => {
        const fetchNumberOfActivities = async () => {
          if (user) {
            const q = query(
              collection(db, 'activities'),
              where('userId', '==', user.uid),
              where('year', '==', year),
            );
            const snapshot = await getCountFromServer(q);
            setNumberOfActivities(snapshot.data().count);
            setLoadingActivities(false);

            const overdueQuery = query(
              collection(db, 'activities'),
              where('userId', '==', user.uid),
              where('year', '==', year),
              where('complete', '==', false),
              where('dueDate', '<', new Date()),
            );
            const overdueSnapshot = await getCountFromServer(overdueQuery);
            setNumberOfOverdue(overdueSnapshot.data().count);
          }
        };

        fetchNumberOfActivities().catch(console.error);
      }, [user]),
    );

    return (
      <Pressable
        onPress={() => {
          navigation.navigate('GradeLevel', { year });
        }}>
        <LinearGradient
          colors={[getColorForYear(year, true), getColorForYear(year)]}
          style={{
            width: cardWidth,
            height: cardHeight,
            margin: 4,
            borderRadius: 8,
          }}>
          <View
            style={{
              display: 'flex',
              margin: 12,
              height: '88%',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text weight="medium">{name}</Text>
              <Text size="xs" style={{ marginTop: 8 }}>
                {objective}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color: getColorForYear(year),
                    fontSize: 8,
                    marginTop: 10,
                  }}>
                  {'\u2B24  '}
                </Text>
                <Text size="xxs" style={{ marginTop: 8 }}>
                  {loadingActivities
                    ? 'Loading your '
                    : numberOfActivities === 0
                      ? 'Creating your '
                      : numberOfActivities + ' '}
                  activities
                </Text>
              </View>
              {numberOfOverdue ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: getColorForYear(year),
                      fontSize: 8,
                      marginTop: 10,
                    }}>
                    {'\u2B24  '}
                  </Text>
                  <Text size="xxs" style={{ marginTop: 8 }}>
                    {numberOfOverdue + ' '}
                    overdue
                    {numberOfOverdue === 1 ? ' activity' : ' activities'}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </View>
            <Text
              weight="light"
              size="xxl"
              style={{ alignSelf: 'flex-end', opacity: 0.7 }}>
              {year}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      style={{ height: windowHeight }}
      colors={[Colors.background, '#2a354c']}>
      <DeleteAccountDialog />
      <View
        style={{
          height: windowHeight,
          marginHorizontal: 16,
        }}>
        <StatusBar backgroundColor={Colors.background} style="light" />
        <IconButton
          style={{
            marginTop: windowHeight / 15,
            marginBottom: 16,
            marginLeft: -8,
          }}
          iconColor={Colors.text}
          onPress={() => setDrawerOpen(true)}
          icon="menu"
        />
        <FlatList
          data={roadmapGradeLevels}
          renderItem={({ item: { year, name, objective } }) => (
            <RoadmapCard {...{ year, name, objective }} />
          )}
          numColumns={2}
          style={{
            alignSelf: 'center',
            height: windowHeight,
            marginBottom: 100,
          }}
          ListHeaderComponent={
            <View style={{ marginHorizontal: 2 }}>
              <Text size="l">Welcome</Text>
              <Text style={{ marginTop: 24, marginBottom: 16 }}>
                Gradeness is designed to simplify the high school process by
                providing a roadmap of time sensitive activities to prepare you
                for your future and a place to capture your accomplishments.
              </Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
};
