import { Dimensions, FlatList, Image, Pressable, Text, View } from 'react-native'
import { Colors, GradeLevels, fontSizes } from '../Constants'
import { getAuth } from 'firebase/auth'
import { getColorForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Drawer } from 'react-native-drawer-layout'
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Icon, IconButton } from '@react-native-material/core'
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message'
import { useAuthentication } from '../utils/hooks/useAuthentication'
import * as Clipboard from 'expo-clipboard'

const roadmapGradeLevels = GradeLevels

type Props = NativeStackScreenProps<RoadmapStackParamList, 'RoadmapHome'>
export const RoadmapScreen = ({ navigation }: Props) => {
  const auth = getAuth()
  const { user } = useAuthentication()
  const [toastHidden, setToastHidden] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  const cardMargin = 16;
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - cardMargin * 3) / 2;
  const cardHeight = cardWidth;

  useEffect(useCallback(() => {
    if (!toastHidden && user) {
      if (!user.emailVerified) {
        Toast.show({
          type: 'success',
          text1: 'Thanks for signing up!',
          text2: 'We sent you a verification email.',
          swipeable: true,
          autoHide: true,
          visibilityTime: 10000,
          topOffset: 75,
          onHide: () => setToastHidden(true)
        });
      }
    }
  }, [user, toastHidden]));

  const DeleteAccountDialog = () => {
    return (
      <Dialog
        visible={deleteAccountDialogOpen} onDismiss={() => setDeleteAccountDialogOpen(false)}
      >
        <DialogHeader title="Delete your account?" />
        <DialogContent>
          <Text>
            You can delete your account with Gradeness but you will lose all of your information. Account deletion will take place in 2-3 business days.
          </Text>
        </DialogContent>
        <DialogActions>
          <Button
            title="Cancel"
            variant='text'
            onPress={() => setDeleteAccountDialogOpen(false)}
          />
          <Button
            title="Delete"
            variant='text'
            onPress={() => {
              setDeleteAccountDialogOpen(false);
              auth.signOut();
              Linking.openURL('https://www.gradeness.app/delete-account');
            }}
          />
        </DialogActions>
      </Dialog>
    )
  }

  const DrawerItem = ({ onPress, iconName, text, subtext, lastItem = false }) => {
    return (
      <Pressable style={{ marginBottom: lastItem ? 0 : 24 }} onPress={onPress}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Icon size={24} name={iconName} color={Colors.background} />
          <View style={{ marginHorizontal: 16 }}>
            <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s, marginBottom: 8 }}>{text}</Text>
            {subtext ? <Text style={{ fontFamily: 'Roboto_300Light', fontSize: fontSizes.xxs, lineHeight: 20 }}>{subtext}</Text> : <></>}
          </View>
        </View>
      </Pressable>
    );
  }

  const DrawerContent = () => {
    return (
      <View style={{ display: 'flex', height: '80%', justifyContent: 'space-between', marginTop: windowHeight / 10, marginHorizontal: 24 }}>
        <View>
          <View>
            <Image source={require('../../assets/slideoutowl.png')} style={{ marginBottom: 36 }} />
            <DrawerItem onPress={() => auth.signOut()} iconName={'logout'} text={'Log out'} subtext={''} />
            <DrawerItem onPress={() => Linking.openURL('https://forms.gle/q6TfiTnTqLYZwZAY8')} iconName={'message-outline'} text={'Give feedback'} subtext={'Your feedback is valuable to us. Click here to respond to our survey and help us improve the app.'} />
            <DrawerItem onPress={() => Linking.openURL('https://www.youtube.com/watch?v=x89dP_hjT1k')} iconName={'video-outline'} text={'Tutorial'} subtext={'Watch on YouTube'} />
            <DrawerItem onPress={() => { }} iconName={'email-outline'} text={'Need help?'} subtext={'Contact us at support@gradeness.app'} />
            {/* todo: copy link to clipboard and toast saying 'copied' */}
            <DrawerItem onPress={() => {
              Clipboard.setStringAsync('https://www.gradeness.app/')
                .then(() => Toast.show({ type: 'success', text1: 'Copied!', position: 'bottom', bottomOffset: 300, swipeable: true }));
            }} iconName={'share-variant-outline'} text={'Share with a friend'} subtext={'Enjoying the app? Share with a friend.'} />
          </View>
        </View>
        <DrawerItem lastItem onPress={() => setDeleteAccountDialogOpen(true)} iconName={'delete-outline'} text={'Delete your account'} subtext={'Account deletion will take place in 2-3 business days.'} />
      </View>
    )
  }

  return (
    <LinearGradient
      style={{ height: '100%' }}
      colors={[Colors.background, '#2a354c']}>
      <Drawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        renderDrawerContent={DrawerContent}
        drawerType='front'
        // todo: known bug using drawerPosition Right: https://github.com/react-navigation/react-navigation/issues/11853
        // drawerPosition='right'
        drawerStyle={{ backgroundColor: '#E9ECF2', width: '90%', borderRadius: 16 }}
        hideStatusBarOnOpen={true}
      >
        <DeleteAccountDialog />
        <View
          style={{ marginHorizontal: 16, marginVertical: windowHeight / 50 }}>
          <StatusBar backgroundColor={Colors.background} style="light" />
          <IconButton
            style={{ marginTop: windowHeight / 10, marginBottom: 16, marginLeft: -12 }}
            onPress={() => setDrawerOpen(true)}
            icon={<Icon size={24} color={Colors.text} name="menu" />}
          />
          <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, fontSize: fontSizes.l }}>Welcome</Text>
          <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginTop: 24, fontSize: fontSizes.s }}>
            Gradeness is designed to simplify the high school process by providing a
            roadmap of time sensitive activities to prepare you for your future and a
            place to capture your accomplishments.
          </Text>
          <View>
            <FlatList
              data={roadmapGradeLevels}
              renderItem={({ item: { year, name, objective } }) => (
                <Pressable
                  onPress={() => { navigation.navigate('GradeLevel', { year }) }}
                >
                  <LinearGradient
                    colors={[getColorForYear(year, true), getColorForYear(year)]}
                    style={{ width: cardWidth, height: cardHeight, margin: 4, borderRadius: 8 }}
                  >
                    <View style={{ display: 'flex', margin: 16, height: '88%', justifyContent: 'space-between' }}>
                      <View>
                        <Text style={{ fontFamily: 'Roboto_500Medium', fontSize: fontSizes.s, color: Colors.text }}>{name}</Text>
                        <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.xs, color: Colors.text, marginTop: 8 }}>{objective}</Text>
                      </View>
                      <Text
                        style={
                          {
                            fontFamily: 'Roboto_300Light',
                            color: Colors.text,
                            fontSize: 32,
                            alignSelf: 'flex-end',
                            opacity: 0.7,
                          }
                        }
                      >
                        {year}
                      </Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              )}
              numColumns={2}
              style={{ marginTop: 24, alignSelf: 'center' }}
            />
          </View>
        </View>
      </Drawer>
    </LinearGradient >
  )
}
