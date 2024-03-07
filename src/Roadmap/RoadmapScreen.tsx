import { Dimensions, FlatList, Image, Pressable, Text, View } from 'react-native'
import { Colors, GradeLevels, fontSizes } from '../Constants'
import { getAuth } from 'firebase/auth'
import { getColorForYear } from '../utils/style'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { type RoadmapStackParamList } from '../navigation/userStackParams'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Drawer } from 'react-native-drawer-layout'
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Icon, IconButton } from '@react-native-material/core'
import * as Linking from 'expo-linking';

const roadmapGradeLevels = GradeLevels

// todo: show banner if they need to verify their email

type Props = NativeStackScreenProps<RoadmapStackParamList, 'RoadmapHome'>
export const RoadmapScreen = ({ navigation }: Props) => {
  const auth = getAuth()

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  const cardMargin = 16;
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const cardWidth = (windowWidth - cardMargin * 3) / 2;
  const cardHeight = cardWidth;

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

  const DrawerContent = () => {
    return (
      <View style={{ display: 'flex', height: '80%', justifyContent: 'space-between', marginTop: windowHeight / 10, marginHorizontal: 24 }}>
        <View>
          <View>
            <Image source={require('../../assets/slideoutowl.png')} style={{ marginBottom: 36 }} />
            <Pressable onPress={() => auth.signOut()} style={{ marginBottom: 24 }}>
              <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s }}><Icon size={24} name='logout' />{'   '}Log out</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL('https://forms.gle/q6TfiTnTqLYZwZAY8')} style={{ marginBottom: 24 }}>
              <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s, marginBottom: 8 }}><Icon size={24} name='message-outline' />{'   '}Give feedback</Text>
              <Text style={{ fontFamily: 'Roboto_300Light', fontSize: fontSizes.xxs, lineHeight: 20, marginLeft: 36 }}>Your feedback is valuable to us. Help us improve the app and respond to <Text style={{ textDecorationLine: 'underline' }}>this survey.</Text></Text>
            </Pressable>
            <View>
              <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s, marginBottom: 8 }}><Icon size={24} name="email-outline" />{'   '}Need help?</Text>
              <Text style={{ fontFamily: 'Roboto_300Light', fontSize: fontSizes.xxs, lineHeight: 20, marginLeft: 36 }}>Contact us at support@gradeness.app</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={() => setDeleteAccountDialogOpen(true)}>
          <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: fontSizes.s, marginBottom: 8 }}><Icon size={24} name="delete-outline" />{'   '}Delete your account</Text>
          <Text style={{ fontFamily: 'Roboto_300Light', fontSize: fontSizes.xxs, lineHeight: 20, marginLeft: 36 }}>Account deletion will take place in 2-3 business days.</Text>
        </Pressable>
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
