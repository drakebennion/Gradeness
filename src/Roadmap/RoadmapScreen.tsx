import { Button, Dimensions, FlatList, Pressable, Text, View } from 'react-native'
import { Colors, GradeLevels } from '../Constants'
import { getAuth } from 'firebase/auth'
import { getColorForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar'

const roadmapGradeLevels = GradeLevels

type Props = NativeStackScreenProps<RoadmapStackParamList, 'RoadmapHome'>
export const RoadmapScreen = ({ navigation }: Props) => {
  const auth = getAuth()

  const cardMargin = 16;
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - cardMargin * 3) / 2;
  const cardHeight = cardWidth;

  return (
    <LinearGradient
      style={{ height: '100%' }}
      colors={[Colors.background, '#2a354c']}>
      <View
        style={{ marginHorizontal: 16, marginVertical: windowHeight / 50, backgroundColor: Colors.background }}>
        <StatusBar backgroundColor={Colors.background} style="light" />
        <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginTop: windowHeight / 10, fontSize: 28 }}>Welcome</Text>
        <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginTop: 24, fontSize: 16 }}>
          {/* <Button style={{ marginTop: 32 }} onPress={() => auth.signOut()} title='Log out' /> */}
          Gradeness is designed to simplify the high school process by providing a
          roadmap of time sensitive activities to prepare you for your future and a
          place to capture your accomplishments.
        </Text>
        <FlatList
          data={roadmapGradeLevels}
          renderItem={({ item: { year, name, objective } }) => (
            <Pressable
              onPress={() => { navigation.navigate('GradeLevel', { year }) }}
            >
              <LinearGradient
                colors={[getColorForYear(year, true), getColorForYear(year)]}
                style={{ width: cardWidth, height: cardHeight, margin: 4, borderRadius: 8 }}
              >
                <View style={{ display: 'flex', margin: 16, height: '88%', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontFamily: 'Roboto_500Medium', fontSize: 16, color: Colors.text }}>{name}</Text>
                    <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 14, color: Colors.text, marginTop: 8 }}>{objective}</Text>
                  </View>
                  <Text
                    style={
                      {
                        fontFamily: 'Roboto_300Light',
                        color: Colors.text,
                        fontSize: 32,
                        alignSelf: 'flex-end',
                        opacity: 0.7,
                      }
                    }
                  >
                    {year}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          )}
          numColumns={2}
          style={{ marginTop: 24, alignSelf: 'center' }}
        />
      </View>
    </LinearGradient >
  )
}
