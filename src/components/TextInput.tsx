import { TextInput as ReactNativePaperTextInput } from 'react-native-paper';
import { Props } from 'react-native-paper/src/components/TextInput/TextInput';
import { Colors } from '../Constants';

export const TextInput = (props: Props) => {
    return (
        <ReactNativePaperTextInput
            mode='outlined'
            textColor={Colors.background}
            selectionColor={Colors.background}
            activeOutlineColor={Colors.background}
            contentStyle={{ backgroundColor: Colors.text, borderWidth: 1 }}
            {...props} />
    )
}