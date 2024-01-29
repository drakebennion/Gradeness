import { Button } from "@react-native-material/core";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { ScrollView, StyleSheet, Text } from "react-native"

export const TaskScreen = ({ navigation, route }) => {
    const db = getFirestore();
    const { taskId, objective, semester, complete } = route.params;

    const markComplete = async () => {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { complete: true });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>{ objective }</Text>
            <Text>{ semester }</Text>
            <Button 
                title="Mark as complete"
                disabled={complete}
                onPress={() => markComplete().then(navigation.pop)}
            />
            <Button 
                title="Go back"
                onPress={() => navigation.pop()}
            />
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