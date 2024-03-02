import { Button, Icon, IconButton, Text, TextInput } from '@react-native-material/core'
import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { Colors, fontSizes, semesters } from "../Constants"
import { useAuthentication } from '../utils/hooks/useAuthentication'
import SelectDropdown from 'react-native-select-dropdown'
import { GradeLevels } from '../Constants'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { useHeaderHeight } from '@react-navigation/elements'

type Props = NativeStackScreenProps<RoadmapStackParamList, 'CreateUpdateActivity'>
export const CreateUpdateActivityScreen = ({ navigation, route }: Props) => {
  const { user } = useAuthentication()
  const db = getFirestore()
  const [activity, setActivity] = useState(route.params?.activity)
  const headerHeight = useHeaderHeight();

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView style={{ backgroundColor: Colors.text, height: '100%', marginTop: 64, paddingVertical: 24, paddingHorizontal: 16, }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 22 }}>{activity?.activityId ? 'Edit' : 'Add'} activity</Text>
          <IconButton
            style={{ marginTop: -8, marginRight: -16 }}
            onPress={() => { navigation.pop() }}
            icon={<Icon size={22} name="close" />}
          />
        </View>
        <View>
          <TextInput
            label="Name"
            variant='outlined'
            style={{ marginBottom: 8 }}
            value={activity?.name}
            onChangeText={(name) => { setActivity({ ...activity, name }) }}
            color={Colors.background}
          />

          <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.xs, marginVertical: 8 }}>Choose the school year you would like to add the activity?</Text>
          <SelectDropdown
            data={GradeLevels}
            onSelect={(gradeLevel) => { setActivity({ ...activity, year: gradeLevel.year }) }}
            rowTextForSelection={(gradeLevel) => gradeLevel.name}
            buttonTextAfterSelection={(gradeLevel) => gradeLevel.name}
            defaultValue={GradeLevels.find(gradeLevel => gradeLevel.year === activity?.year)}
            defaultButtonText="Year"
            buttonStyle={{ width: '100%' }}
          />

          <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.xs, marginTop: 16, marginBottom: 8 }}>What semester or time of year do you want to complete this activity?</Text>
          <SelectDropdown
            data={semesters}
            onSelect={(semester) => { setActivity({ ...activity, semester }) }}
            defaultValue={activity?.semester}
            defaultButtonText="Semester"
            buttonStyle={{ width: '100%' }}
          />

          <TextInput
            label="Description"
            variant='outlined'
            multiline
            value={activity?.description}
            onChangeText={(description) => { setActivity({ ...activity, description }) }}
            style={{ marginVertical: 24 }}
            inputStyle={{ margin: 8 }}
            color={Colors.background}
          />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              color={Colors.text} tintColor={Colors.background}
              title="Cancel"
              style={{ marginRight: 8 }}
              onPress={() => { navigation.pop() }}
            />
            <Button
              color={Colors.background} tintColor={Colors.text}
              title="Save"
              disabled={!(activity && activity.year && activity.semester && activity.description && activity.name)}
              onPress={async () => { await updateActivityWithDatabase().then(() => { navigation.goBack() }) }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
