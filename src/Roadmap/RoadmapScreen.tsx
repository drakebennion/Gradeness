import { Button, Pressable } from '@react-native-material/core'
import { Text, View } from 'react-native'
import { Colors, GradeLevels } from '../Constants'
import { getAuth, signOut } from 'firebase/auth'
import { doDataImport } from '../utils/init/db'
import { getColorForYear, getGradeLevelNameForYear, getGradeLevelObjectiveForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar'

const roadmapGradeLevels = GradeLevels

type Props = NativeStackScreenProps<RoadmapStackParamList, 'RoadmapHome'>
export const RoadmapScreen = ({ navigation }: Props) => {
  const auth = getAuth()

  return (
    <View>
      <StatusBar style="light" />
      <Button style={{ marginTop: 32 }} onPress={() => auth.signOut()} title='Log out' />
      <Text style={{ color: Colors.text, marginTop: 16, fontSize: 36 }}>Welcome</Text>
      <Text style={{ color: Colors.text, marginTop: 8 }}>
        Gradeness is designed to simplify the high school process by providing a
        roadmap of time sensitive activities to prepare you for your future and a
        place to capture your accomplishments.
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
        {
          roadmapGradeLevels.map(({ year, objective }) =>
            <Pressable key={year}
              pressEffect='ripple'
              onPress={() => { navigation.navigate('GradeLevel', { year }) }}
            >
              <LinearGradient
                key={year}
                colors={[getColorForYear(year, true), getColorForYear(year)]}
                style={{
                  borderRadius: 8,
                  width: 172,
                  height: 160,
                  marginVertical: 8,
                  marginRight: 8,
                  marginLeft: 4
                }}>
                <Text style={{ color: Colors.text }}>{getGradeLevelNameForYear(year)}</Text>
                <Text style={{ color: Colors.text }}>{getGradeLevelObjectiveForYear(year)}</Text>
              </LinearGradient>
            </Pressable>
          )
        }
      </View>

      {/* <Button title="IMPORT DATA DRAKE" onPress={doDataImport}/> */}
    </View >
  )
}
