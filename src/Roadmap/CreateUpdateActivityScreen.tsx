import { Button, Text, TextInput } from "@react-native-material/core";
import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { View } from "react-native";
import { Colors } from "../Colors";
import { getGradeLevelNameForYear, getGradeLevelYearForName } from "../utils/style";
import { useAuthentication } from "../utils/hooks/useAuthentication";

export const CreateUpdateActivityScreen = ({ navigation, route }) => {
    const { user } = useAuthentication();
    const db = getFirestore();
    const [activity, setActivity] = useState(route.params?.activity || { year: 10, });

    const updateActivityWithDatabase = async () => {
        
        // todo: also need to do some validation - need to make sure all fields are filled
        if (activity.activityId) {
            const activityRef = doc(db, 'activities', activity.activityId);
            const activityEntity = {
                ...activity, 
                updatedAt: Date.now(),
                updatedBy: user.uid,
            };
            await setDoc(activityRef, activityEntity, { merge: true }).catch(console.error);
        } else {
            // todo: need to get the 'order' this task should be in!!! heavens me
            const activityEntity = {
                ...activity, 
                userId: user.uid,
                createdAt: Date.now(),
                createdBy: user.uid,
                updatedAt: Date.now(),
                updatedBy: user.uid,
            };
            console.log(activityEntity)
            await addDoc(collection(db, 'activities'), activityEntity).catch(console.error);
        }
        
    }

    
    return (
        <View>
            <Text>Create or Update an activity :) </Text>
            <View>
            <TextInput 
                label="Name"
                value={activity.objective}
                onChangeText={(objective) => setActivity({ ...activity, objective })}
            />
            {/* todo: make year and semester dropdowns, also handle discrepancy of year being a number but textinputs being strings y'know y'now */}
            <TextInput 
                label="Year"
                value={getGradeLevelNameForYear(activity.year)}
                // todo: change this back to number before save lol
                onChangeText={(year) => setActivity({ ...activity, year: getGradeLevelYearForName(year)})}
            />
            <TextInput 
                label="Semester"
                value={activity.semester}
                onChangeText={(semester) => setActivity({ ...activity, semester })}
            />
            <TextInput 
                label="Description"
                value={activity.description}
                onChangeText={(description) => setActivity({ ...activity, description })}
            />
            <Button 
                color={Colors.highlight2} tintColor={Colors.background}
                title="Save"
                onPress={() => updateActivityWithDatabase().then(() => navigation.goBack())}
            />
            <Button 
                color={Colors.background} tintColor={Colors.highlight2}
                title="Cancel"
            />
        </View>
            <Button title="Close" onPress={ () => navigation.goBack() }/>
        </View>
    );
}