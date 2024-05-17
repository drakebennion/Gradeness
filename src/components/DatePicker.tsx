import { Pressable, View, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Text } from '../Typography';

export default function DatePicker({ date, setDate, minimumDate }) {
  const onChange = (_, selectedDate) => {
    setDate(selectedDate);
  };

  if (Platform.OS === "android") {
    const showMode = (currentMode) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        minimumDate,
      });
    };

    const showDatepicker = () => {
      showMode("date");
    };

    return (
      <View style={styles.androidDateTime}>
        <Pressable onPress={showDatepicker}>
          <Text color='background'>
            {date.toLocaleDateString([], {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        onChange={onChange}
        minimumDate={minimumDate}
      />
    );
  }
}

const styles = StyleSheet.create({
  androidDateTime: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});