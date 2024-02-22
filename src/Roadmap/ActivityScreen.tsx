import { Button, Icon, IconButton, TextInput } from '@react-native-material/core'
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { useCallback, useState } from 'react'
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Colors } from "../Constants"
import { useFocusEffect } from '@react-navigation/native'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import { getGradeLevelNameForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type Activity } from '../types/Activity'
import * as Progress from 'react-native-progress'

type Props = NativeStackScreenProps<UserStackParamList, 'Activity'>
export const ActivityScreen = ({ navigation, route }: Props) => {
  const db = getFirestore()
  const { user } = useAuthentication()
  const { activityId } = route.params
  const [activity, setActivity] = useState<Activity | undefined>()
  const [accomplishment, setAccomplishment] = useState({ id: null, content: {} });
  const [addAccomplishment, setAddAccomplishment] = useState('')
  const [loadingActivity, setLoadingActivity] = useState(true)

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
        if (activityId && user) {
          const activity = await getDoc(doc(db, 'activities', activityId))
          // todo: need handling for if there are no activities at all, plus network error handling
          // todo: mapper for firestore data to Activity
          setActivity(activity.data())
          setLoadingActivity(false)

          const q = query(collection(db, 'accomplishments'),
            where('userId', '==', user.uid))
          const accomplishment = await getDocs(q);
          const accomplishmentData = accomplishment.docs.map(doc => ({ id: doc.id, content: doc.data().content, ...doc.data() }))

          setAccomplishment(accomplishmentData[0])
        }
      }

      fetchData().catch(console.error)
    }, [activityId, user])
  )

  return (
    loadingActivity
      ? <Progress.Circle size={40} indeterminate={true} color={Colors.highlight2} borderWidth={3} style={{ alignSelf: 'center', marginTop: '66%' }} />
      :
      <View style={{ marginVertical: Dimensions.get('window').height / 10 }}>
        <View style={{ marginBottom: 16 }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <IconButton
              onPress={() => { navigation.pop() }}
              icon={<Icon size={24} color={Colors.text} name="arrow-left" />}
            />
            {!!activity.testActivityId ? <></> :
              <IconButton
                onPress={() => { navigation.navigate('CreateUpdateActivity', { activity: { activityId, name: activity.name, semester: activity.semester, year: activity.year, description: activity.description } }) }}
                icon={<Icon size={24} color={Colors.text} name="square-edit-outline" />}
              />
            }
          </View>
          <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, fontSize: 24, marginTop: 8, marginLeft: 16, marginRight: 8 }}>
            {activity.name}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <ImageBackground source={require('../../assets/activities/orientation.png')} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 12, height: 160 }}>
              {/* todo: pull this into a Badge component */}
              <View style={{ backgroundColor: Colors.text, padding: 8, borderRadius: 8, margin: 8, alignSelf: 'flex-end' }}>
                <Text style={{ fontFamily: 'Roboto_400Regular' }}>{activity.semester}</Text>
              </View>
              <View style={{ backgroundColor: Colors.text, padding: 8, borderRadius: 8, margin: 8, alignSelf: 'flex-end' }}>
                <Text style={{ fontFamily: 'Roboto_400Regular' }}>{getGradeLevelNameForYear(activity.year)}</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
            {/* todo: could def handle this better - if no overview show nothing, if overview is string display it, otherwise show header and items */}
            {typeof activity.overview === "string" ?
              <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, marginBottom: 12 }}>{activity.overview}</Text> :

              activity.overview ?
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, marginBottom: 12 }}>{activity.overview.header}</Text>
                  {
                    activity.overview.items.map(item =>
                      <Text key={item} style={{ marginLeft: 16 }}>{`\u2022 ${item}`}</Text>
                    )
                  }
                </View> : <></>
            }
            <Button
              color={activity.complete ? Colors.text : Colors.highlight2}
              tintColor={Colors.background}
              leading={activity.complete ? <Icon name='check' size={16} /> : <></>}
              title={activity.complete ? 'Complete' : 'Mark complete'}
              onPress={async () => { await toggleComplete().then(() => { navigation.pop() }) }}
              style={{ marginBottom: 24 }}
            />

            <View style={{ marginBottom: 24 }}>
              <Text style={{ marginTop: 16 }}>Capture your accomplishments</Text>
              <TextInput
                label="Accomplishments"
                multiline
                variant="outlined"
                value={addAccomplishment}
                onChangeText={(content) => {
                  setAddAccomplishment(content)
                }}
                style={{ marginTop: 16, }}
                inputStyle={{ margin: 8 }}
                color={Colors.background}
              />
              <Button disabled={!accomplishment} color={Colors.background} style={{ alignSelf: 'flex-end', marginTop: 8 }} title="Save" onPress={() => saveAccomplishment().then(() => setAddAccomplishment(''))} />
              {/* todo: pop toast when accomplishment saved */}
            </View>

            {
              typeof activity.description === "string" ?
                <Text style={{ fontFamily: 'Roboto_400Regular' }}>{activity.description}</Text>
                :
                <View>
                  <Text style={{ fontFamily: 'Roboto_400Regular' }}>{activity.description.header}</Text>
                  <View style={{ margin: 12, }}>
                    {
                      activity.description.items.map(item => {
                        const headerAndContent = item.split(':');
                        return <View key={item} style={{ marginBottom: 8 }}>
                          <Text style={{ fontWeight: 'bold' }}>{headerAndContent[0]}:
                            <Text style={{ fontWeight: 'normal' }}>{headerAndContent[1]}</Text>
                          </Text>

                        </View>
                      }
                      )
                    }
                  </View>
                  <Text style={{ fontFamily: 'Roboto_400Regular' }}>{activity.description.footer}</Text>
                </View>
            }
          </View>
        </ScrollView>
      </View>
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
