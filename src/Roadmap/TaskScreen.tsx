import { Button, TextInput } from "@react-native-material/core";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Colors } from "../Colors";

export const TaskScreen = ({ navigation, route }) => {
    const db = getFirestore();
    const { taskId, objective, semester, complete, year } = route.params;
    const [editMode, setEditMode] = useState(false);
    const [task, setTask] = useState({
        objective,
        semester,
    });

    const toggleComplete = async () => {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { complete: !complete });
    };

    const updateTaskWithDatabase = async () => {
        // todo: is there a better way of not duplicating this?
        const taskRef = doc(db, 'tasks', taskId);

        await updateDoc(taskRef, task);
    }

    const ReadView = () => (
        <View>
            <Text>{ task.objective }</Text>
            <Text>{ task.semester }</Text>
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
                label="Task"
                value={task.objective}
                onChangeText={(objective) => setTask({ ...task, objective })}
            />
            <Button 
                color={Colors.highlight2} tintColor={Colors.background}
                title="Save"
                onPress={() => updateTaskWithDatabase().then(() => setEditMode(false))}
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