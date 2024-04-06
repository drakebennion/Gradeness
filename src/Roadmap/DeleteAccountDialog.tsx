import { Button, Dialog, DialogActions, DialogContent, DialogHeader } from '@react-native-material/core'
import * as Linking from 'expo-linking';
import { RoadmapDialogContext } from '../Contexts';
import { useContext } from 'react';
import { Text } from '../Typography'
import { auth } from "../../firebaseConfig";

export const DeleteAccountDialog = () => {
    const { dialogOpen, setDialogOpen } = useContext(RoadmapDialogContext);

    return (
        <Dialog
            visible={dialogOpen} onDismiss={() => setDialogOpen(false)}
        >
            <DialogHeader title="Delete your account?" />
            <DialogContent>
                <Text color='background' size='xs'>
                    You can delete your account with Gradeness but you will lose all of your information. Account deletion will take place in 2-3 business days.
                </Text>
            </DialogContent>
            <DialogActions>
                <Button
                    title="Cancel"
                    variant='text'
                    onPress={() => setDialogOpen(false)}
                />
                <Button
                    title="Delete"
                    variant='text'
                    onPress={() => {
                        setDialogOpen(false);
                        auth.signOut();
                        Linking.openURL('https://www.gradeness.app/delete-account');
                    }}
                />
            </DialogActions>
        </Dialog >
    )
}