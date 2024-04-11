import { Icon } from "react-native-paper"
import { Dimensions, Linking, Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { auth } from "../../firebaseConfig";
import { Colors } from "../Constants";
import * as Clipboard from 'expo-clipboard'
import { Text } from '../Typography'
import { Image } from 'react-native'
import { useContext } from "react";
import { RoadmapDialogContext } from "../Contexts";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import * as Updates from 'expo-updates';

const DrawerItem = ({ onPress, iconName, text, subtext, lastItem = false }) => {
    return (
        <Pressable style={{ marginBottom: lastItem ? 0 : 24 }} onPress={onPress}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Icon size={24} source={iconName} color={Colors.background} />
                <View style={{ marginHorizontal: 16 }}>
                    <Text color='background' style={{ marginBottom: 8 }}>{text}</Text>
                    {subtext ? <Text weight='light' size='xxs' color='background' style={{ lineHeight: 20 }}>{subtext}</Text> : <></>}
                </View>
            </View>
        </Pressable>
    );
}

export const DrawerContent = () => {
    const windowHeight = Dimensions.get('window').height;
    const { setDialogOpen } = useContext(RoadmapDialogContext);
    const { user } = useAuthentication();

    return (
        <View style={{ display: 'flex', height: '85%', justifyContent: 'space-between', marginTop: windowHeight / 10, marginHorizontal: 24 }}>
            <View>
                <View>
                    <Image source={require('../../assets/slideoutowl.png')} style={{ marginBottom: 36 }} />
                    <DrawerItem onPress={() => auth.signOut()} iconName={'logout'} text={'Log out'} subtext={''} />
                    <DrawerItem onPress={() => Linking.openURL('https://forms.gle/q6TfiTnTqLYZwZAY8')} iconName={'message-outline'} text={'Give feedback'} subtext={'Your feedback is valuable to us. Click here to respond to our survey and help us improve the app.'} />
                    <DrawerItem onPress={() => Linking.openURL('https://www.youtube.com/watch?v=x89dP_hjT1k')} iconName={'video-outline'} text={'Tutorial'} subtext={'Watch on YouTube'} />
                    <DrawerItem onPress={() => { }} iconName={'email-outline'} text={'Need help?'} subtext={'Contact us at support@gradeness.app'} />
                    <DrawerItem onPress={() => {
                        Clipboard.setStringAsync('https://www.gradeness.app/')
                            .then(() => Toast.show({ type: 'success', text1: 'Copied!', position: 'bottom', bottomOffset: 300, swipeable: true }));
                    }} iconName={'share-variant-outline'} text={'Share with a friend'} subtext={'Enjoying the app? Share with a friend.'} />
                    {
                        // drake
                        user?.uid === 'WTEFA5EQstZemjYx55samSY0rzl1' &&
                        <DrawerItem onPress={() => { }} iconName={'information-outline'} text={'update number: ' + Updates.updateId} subtext={''} />
                    }
                </View>
            </View>
            <DrawerItem lastItem onPress={() => setDialogOpen(true)} iconName={'delete-outline'} text={'Delete your account'} subtext={'Account deletion will take place in 2-3 business days.'} />
        </View>
    )
}