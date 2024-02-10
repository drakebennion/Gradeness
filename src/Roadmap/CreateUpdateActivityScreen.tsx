import { Button, Text, TextInput } from '@react-native-material/core'
import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { View } from 'react-native'
import { Colors, semesters } from "../Constants"
import { useAuthentication } from '../utils/hooks/useAuthentication'
import SelectDropdown from 'react-native-select-dropdown'
import { GradeLevels } from '../Constants'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'

type Props = NativeStackScreenProps<RoadmapStackParamList, 'CreateUpdateActivity'>
export const CreateUpdateActivityScreen = ({ navigation, route }: Props) => {
  const { user } = useAuthentication()
  const db = getFirestore()
  const [activity, setActivity] = useState(route.params?.activity)

  const updateActivityWithDatabase = async () => {
    // todo: also need to do some validation - need to make sure all fields are filled
    if (activity.activityId) {
      const activityRef = doc(db, 'activities', activity.activityId)
      const activityEntity = {
        ...activity,
        updatedAt: Date.now(),
        updatedBy: user.uid
      }
      await setDoc(activityRef, activityEntity, { merge: true }).catch(console.error)
    } else {
      // todo: need to get the 'order' this activity should be in!!! heavens me
      const activityEntity = {
        ...activity,
        userId: user.uid,
        createdAt: Date.now(),
        createdBy: user.uid,
        updatedAt: Date.now(),
        updatedBy: user.uid
      }
      await addDoc(collection(db, 'activities'), activityEntity).catch(console.error)
    }
  }

  return (
    <View>
      <Text>Create or Update an activity</Text>
      <View>
        <TextInput
          label="Name"
          value={activity?.name}
          onChangeText={(name) => { setActivity({ ...activity, name }) }}
        />
        <SelectDropdown
          data={GradeLevels}
          onSelect={(gradeLevel) => { setActivity({ ...activity, year: gradeLevel.year }) }}
          rowTextForSelection={(gradeLevel) => gradeLevel.name}
          buttonTextAfterSelection={(gradeLevel) => gradeLevel.name}
          defaultValue={GradeLevels.find(gradeLevel => gradeLevel.year === activity?.year)}
          defaultButtonText="Choose a year"
        />
        <SelectDropdown
          data={semesters}
          onSelect={(semester) => { setActivity({ ...activity, semester }) }}
          defaultValue={activity?.semester}
          defaultButtonText="Choose a semester"
        />
        <TextInput
          label="Description"
          value={activity?.description}
          onChangeText={(description) => { setActivity({ ...activity, description }) }}
        />
        <Button
          color={Colors.highlight2} tintColor={Colors.background}
          title="Save"
          disabled={!(activity && activity.year && activity.semester && activity.description && activity.name)}
          onPress={async () => { await updateActivityWithDatabase().then(() => { navigation.goBack() }) }}
        />
        <Button
          color={Colors.background} tintColor={Colors.highlight2}
          title="Cancel"
        />
      </View>
      <Button title="Close" onPress={() => { navigation.goBack() }} />
    </View>
  )
}
