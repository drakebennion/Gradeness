import { Button, Text } from "@react-native-material/core";
import { View } from "react-native";

export const CreateUpdateActivityScreen = ({ navigation, route }) => {
    return (
        <View>
            <Text>Create or Update an activity :) </Text>
            <Button title="Close" onPress={ () => navigation.goBack() }/>
        </View>
    );
}