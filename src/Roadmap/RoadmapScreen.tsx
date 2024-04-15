import { Dimensions, FlatList, Pressable, View } from 'react-native'
import { Colors, GradeLevels } from '../Constants'
import { getColorForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar'
import { useCallback, useContext, useEffect, useState } from 'react'
import { IconButton } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { Text } from '../Typography'
import { useFocusEffect } from '@react-navigation/native'
import { collection, getCountFromServer, getFirestore, query, where } from 'firebase/firestore'
import { RoadmapDrawerContext } from '../Contexts'
import { DeleteAccountDialog } from './DeleteAccountDialog'

const roadmapGradeLevels = GradeLevels

type Props = NativeStackScreenProps<RoadmapStackParamList, 'Roadmap'>
export const RoadmapScreen = ({ navigation }: Props) => {
  const { user } = useAuthentication()
  const [toastHidden, setToastHidden] = useState(false);
  const db = getFirestore();

  const { setDrawerOpen } = useContext(RoadmapDrawerContext);

  const cardMargin = 16;
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - cardMargin * 3) / 2;
  const cardHeight = cardWidth;

  useEffect(useCallback(() => {
    if (!toastHidden && user) {
      if (!user.emailVerified) {
        Toast.show({
          type: 'success',
          text1: 'Thanks for signing up!',
          text2: 'We sent you a verification email.',
          swipeable: true,
          autoHide: true,
          visibilityTime: 10000,
          topOffset: 75,
          onHide: () => setToastHidden(true)
        });
      }
    }
  }, [user, toastHidden]));

  const RoadmapCard = ({ year, name, objective }) => {
    const [numberOfActivities, setNumberOfActivities] = useState(0);
    const [loadingActivities, setLoadingActivities] = useState(true);
    useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          if (user) {
            const q = query(collection(db, 'activities'),
              where('userId', '==', user.uid),
              where('year', '==', year));
            const snapshot = await getCountFromServer(q);
            setNumberOfActivities(snapshot.data().count);
            setLoadingActivities(false);
          }
        }

        fetchData().catch(console.error)
      }, [user])
    )

    return (
      <Pressable
        onPress={() => { navigation.navigate('GradeLevel', { year }) }}
      >
        <LinearGradient
          colors={[getColorForYear(year, true), getColorForYear(year)]}
          style={{ width: cardWidth, height: cardHeight, margin: 4, borderRadius: 8 }}
        >
          <View style={{ display: 'flex', margin: 16, height: '88%', justifyContent: 'space-between' }}>
            <View>
              <Text weight='medium'>{name}</Text>
              <Text size='xs' style={{ marginTop: 8 }}>{objective}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: getColorForYear(year), fontSize: 8, marginTop: 10 }} >{'\u2B24  '}</Text>
                <Text size='xxs' style={{ marginTop: 8 }}>
                  {loadingActivities ? 'Loading your ' : numberOfActivities === 0 ? 'Creating your ' : numberOfActivities + ' '}activities
                </Text>
              </View>
            </View>
            <Text weight='light' size='xxl' style={{ alignSelf: 'flex-end', opacity: 0.7 }}>{year}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <LinearGradient
      style={{ height: '100%' }}
      colors={[Colors.background, '#2a354c']}>
      <DeleteAccountDialog />
      <View
        style={{ marginHorizontal: 16, marginVertical: windowHeight / 50 }}>
        <StatusBar backgroundColor={Colors.background} style="light" />
        <IconButton
          style={{ marginTop: windowHeight / 10, marginBottom: 16, marginLeft: -12 }}
          iconColor={Colors.text}
          onPress={() => setDrawerOpen(true)}
          icon='menu'
        />
        <Text size='l'>Welcome</Text>
        <Text style={{ marginTop: 24 }}>
          Gradeness is designed to simplify the high school process by providing a
          roadmap of time sensitive activities to prepare you for your future and a
          place to capture your accomplishments.
        </Text>
        <View>
          <FlatList
            data={roadmapGradeLevels}
            renderItem={({ item: { year, name, objective } }) => (
              <RoadmapCard {...{ year, name, objective }} />
            )}
            numColumns={2}
            style={{ marginTop: 24, alignSelf: 'center' }}
          />
        </View>
      </View>
    </LinearGradient >
  )
}
