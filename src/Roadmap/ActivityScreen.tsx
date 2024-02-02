import { Button, TextInput } from "@react-native-material/core";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Colors } from "../Colors";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getGradeLevelNameForYear } from "../utils/style";

export const ActivityScreen = ({ navigation, route }) => {
    const db = getFirestore();
    const { user } = useAuthentication();
    const { activityId } = route.params;
    const [activity, setActivity] = useState({ activityId });
    const [loadingActivity, setLoadingActivity] = useState(true);

    const toggleComplete = async () => {
        const activityRef = doc(db, 'activities', activityId);
        await updateDoc(activityRef, { complete: !activity.complete });
    };
    
    useFocusEffect(
        useCallback(() => {
          const fetchData = async () => {
                if (activityId && user) {
                  const activity = await getDoc(doc(db, "activities", activityId));
                  // todo: need handling for if there are no activities at all, plus network error handling
                  setActivity(activity.data());
                  setLoadingActivity(false);
                }
              }
          
              fetchData().catch(console.error);
        }, [activityId, user])
      );

    return (
        loadingActivity ? <Text>Loading</Text> : 
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <Text>{ activity.objective }</Text>
                <Text>{ activity.semester }</Text>
                <Text>{ getGradeLevelNameForYear(activity.year) }</Text>
                <Text>{ activity.description }</Text>
                <Button 
                    title="Edit"
                    color={Colors.background} tintColor={Colors.highlight2}
                    onPress={() => navigation.navigate('CreateUpdateActivity', { activity: { activityId, objective: activity.objective, semester: activity.semester, year: activity.year, description: activity.description  } })}
                />
                <Button 
                    color={Colors.highlight2} tintColor={Colors.background}
                    title={ activity.complete ? "Mark as incomplete" : "Mark as complete" }
                    onPress={() => toggleComplete().then(navigation.pop)}
                />
                <Button 
                    title="Go back"
                    onPress={() => navigation.goBack()}
                />
            </View>
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