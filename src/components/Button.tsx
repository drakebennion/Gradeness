import { Button as ReactNativePaperButton } from 'react-native-paper';
import { Props } from 'react-native-paper/src/components/Button/Button';
import { Colors } from '../Constants';

type ButtonProps = Props & { type: 'primary' | 'secondary' | 'tertiary' };
export const Button = (props: ButtonProps) => {
  const colors = {
    primary: {
      buttonColor: Colors.highlight2,
      textColor: Colors.background,
    },
    secondary: {
      buttonColor: Colors.text,
      textColor: Colors.background,
    },
    tertiary: {
      buttonColor: Colors.background,
      textColor: Colors.text,
    },
  };

  return (
    <ReactNativePaperButton
      mode={props.type === 'secondary' ? 'outlined' : 'contained'}
      {...colors[props.type]}
      {...props}>
      {props.children}
    </ReactNativePaperButton>
  );
};
