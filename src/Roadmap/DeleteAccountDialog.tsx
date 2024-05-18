import * as Linking from 'expo-linking';
import { useContext } from 'react';
import { Dialog, Portal } from 'react-native-paper';
import { auth } from '../../firebaseConfig';
import { Colors } from '../Constants';
import { RoadmapDialogContext } from '../Contexts';
import { Text } from '../Typography';
import { Button } from '../components/Button';

export const DeleteAccountDialog = () => {
  const { dialogOpen, setDialogOpen } = useContext(RoadmapDialogContext);

  return (
    <Portal>
      <Dialog
        visible={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        style={{ backgroundColor: Colors.text }}>
        <Dialog.Title>Delete your account?</Dialog.Title>
        <Dialog.Content>
          <Text color="background" size="xs">
            You can delete your account with Gradeness but you will lose all of
            your information. Account deletion will take place in 2-3 business
            days.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            type="primary"
            buttonColor={Colors.text}
            onPress={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            type="primary"
            buttonColor={Colors.text}
            onPress={() => {
              setDialogOpen(false);
              auth.signOut();
              Linking.openURL('https://www.gradeness.app/delete-account');
            }}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
