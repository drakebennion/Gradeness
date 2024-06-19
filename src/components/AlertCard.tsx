import { StyleSheet, View } from 'react-native';
import { Icon, Card as ReactNativePaperCard, Text } from 'react-native-paper';

export type AlertType = 'info' | 'warning' | 'error';

export interface IAlertCardProps {
  alertType: AlertType;
  flavorText: string | JSX.Element;
  errorText: string | JSX.Element;
}
export const AlertCard = (props: IAlertCardProps) => {
  const alertType = {
    info: {
      icon: 'information-outline',
      background: 'rgba(144, 238, 144, .1)',
    },
    warning: {
      icon: 'alert-outline',
      background: 'rgba(255, 219, 187, .1)',
    },
    error: {
      icon: 'alert-rhombus-outline',
      background: 'rgba(246, 98, 157, .1)',
    },
  };

  return (
    <ReactNativePaperCard
      mode="outlined"
      style={{
        marginBottom: 24,
        backgroundColor: alertType[props.alertType].background,
      }}>
      <ReactNativePaperCard.Content>
        <View
          style={{
            ...styles.container,
          }}>
          <View style={{ marginRight: 8 }}>
            <Icon size={24} source={alertType[props.alertType].icon} />
          </View>
          <View style={{ gap: 8, marginRight: 16, paddingRight: 8 }}>
            <Text>{props.flavorText}</Text>
            <Text>{props.errorText}</Text>
          </View>
        </View>
      </ReactNativePaperCard.Content>
    </ReactNativePaperCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
