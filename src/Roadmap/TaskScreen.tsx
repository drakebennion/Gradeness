import { Button, ScrollView, StyleSheet, Text } from "react-native"

export const TaskScreen = ({ navigation, route }) => {
    const { objective, semester } = route.params;
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>{ objective }</Text>
            <Text>{ semester }</Text>
            <Button title="Mark as complete"/>
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