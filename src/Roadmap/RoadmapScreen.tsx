import { Dimensions, FlatList, Pressable, Text, View } from 'react-native'
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
  const cardWidth = (Dimensions.get('window').width - cardMargin * 3) / 2;

  return (
    <View style={{ marginHorizontal: 16, marginVertical: 32 }}>
      <StatusBar style="light" />
      {/* <Button style={{ marginTop: 32 }} onPress={() => auth.signOut()} title='Log out' /> */}
      <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginTop: 16, fontSize: 28 }}>Welcome</Text>
      <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginTop: 8, fontSize: 16 }}>
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
              style={{ width: cardWidth, height: 160, margin: 4, borderRadius: 8 }}
            >
              <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text }}>{name}</Text>
              <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text }}>{objective}</Text>
              <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text }}>{year}</Text>
            </LinearGradient>
          </Pressable>
        )}
        numColumns={2}
        style={{ marginTop: 24, alignSelf: 'center' }}
      />
    </View >
  )
}
