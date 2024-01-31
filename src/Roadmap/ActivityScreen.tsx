import { Button, TextInput } from "@react-native-material/core";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Colors } from "../Colors";

export const ActivityScreen = ({ navigation, route }) => {
    const db = getFirestore();
    const { activityId, objective, semester, complete, year } = route.params;
    const [editMode, setEditMode] = useState(false);
    const [activity, setActivity] = useState({
        objective,
        semester,
    });

    const toggleComplete = async () => {
        const activityRef = doc(db, 'activities', activityId);
        await updateDoc(activityRef, { complete: !complete });
    };

    const updateActivityWithDatabase = async () => {
        // todo: is there a better way of not duplicating this?
        const activityRef = doc(db, 'activities', activityId);

        await updateDoc(activityRef, activity);
    }

    const ReadView = () => (
        <View>
            <Text>{ activity.objective }</Text>
            <Text>{ activity.semester }</Text>
            <Button 
                title="Edit"
                color={Colors.background} tintColor={Colors.highlight2}
                onPress={() => { setEditMode(true); }}
            />
            <Button 
                color={Colors.highlight2} tintColor={Colors.background}
                title={ complete ? "Mark as uncomplete" : "Mark as complete" }
                onPress={() => toggleComplete().then(navigation.pop)}
            />
            <Button 
                title="Go back"
                onPress={() => navigation.pop()}
            />
        </View>
    );

    const EditView = () => (
        <View>
            <TextInput 
                label="Activity"
                value={activity.objective}
                onChangeText={(objective) => setActivity({ ...activity, objective })}
            />
            <Button 
                color={Colors.highlight2} tintColor={Colors.background}
                title="Save"
                onPress={() => updateActivityWithDatabase().then(() => setEditMode(false))}
            />
            <Button 
                color={Colors.background} tintColor={Colors.highlight2}
                title="Cancel"
                onPress={() => { setEditMode(false); }}
            />
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            { editMode ? EditView() : ReadView() }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      display: 'flex',
      justifyContent: 'space-between',
      marginVertical: 32,
      paddingBottom: 32,
      padding: 8,
      paddingRight: 16,
    },
  });