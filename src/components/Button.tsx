import { Button as ReactNativePaperButton } from "react-native-paper";
import { Props } from "react-native-paper/src/components/Button/Button";
import { Colors } from "../Constants";

type ButtonProps = Props & { type: 'primary' | 'secondary' | 'tertiary' };
export const Button = (props: ButtonProps) => {
    const colors = {
        'primary': {
            buttonColor: Colors.highlight2,
            textColor: Colors.background
        },
        'secondary': {
            buttonColor: Colors.text,
            textColor: Colors.background,
        }
    };

    return (
        <ReactNativePaperButton
            mode='contained'
            {...colors[props.type]}
            {...props}
        >
            {props.children}
        </ReactNativePaperButton>
    );
}