import { Button, Icon, IconButton, TextInput } from "@react-native-material/core"
import { Text, KeyboardAvoidingView, Platform, ScrollView, View, Dimensions } from "react-native"
import { Colors, GradeLevels } from "../Constants"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
import { useAuthentication } from "../utils/hooks/useAuthentication"
import { useHeaderHeight } from "@react-navigation/elements"
import * as Progress from 'react-native-progress'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'

export const AccomplishmentScreen = ({ navigation }) => {
    const db = getFirestore()
    const { user } = useAuthentication()
    const [accomplishment, setAccomplishment] = useState({ id: '', content: {} })
    const [loadingAccomplishment, setLoadingAccomplishment] = useState(true)
    const headerHeight = useHeaderHeight();

    // todo: pull addaccomplishments into its own component
    const [yearAccomplishmentContent, setYearAccomplishmentContent] = useState('');
    const [editYear, setEditYear] = useState(0);
    const [shouldRefetch, setShouldRefetch] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (user && shouldRefetch) {
                    const q = query(collection(db, 'accomplishments'),
                        where('userId', '==', user.uid));
                    const accomplishment = await getDocs(q)
                    // todo: still handle firestore typing!
                    const accomplishmentData = accomplishment.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0]
                    // todo: need handling for if there are no accomplishments at all, plus network error handling
                    setAccomplishment(accomplishmentData)
                    setLoadingAccomplishment(false)
                    setShouldRefetch(false)
                }
            }

            fetchData().catch(console.error)
        }, [user, shouldRefetch])
    )

    const saveAccomplishment = async () => {
        if (!yearAccomplishmentContent || editYear === 0) return;

        const accomplishmentRef = doc(db, 'accomplishments', accomplishment.id)

        const accomplishmentEntity = {
            ...accomplishment,
            updatedAt: Date.now(),
            updatedBy: user.uid,
            content: {
                ...accomplishment.content,
                [editYear]: yearAccomplishmentContent
            }
        };

        await setDoc(accomplishmentRef, accomplishmentEntity, { merge: true }).catch(console.error)
    }

    const toggleEditing = (year: number) => {
        if (year === 0) {
            setEditYear(0);
            setYearAccomplishmentContent('');
            setShouldRefetch(true)
        } else {
            setEditYear(year);
            setYearAccomplishmentContent(accomplishment.content[year]);
        }
    }

    const copyToClipboard = async () => {
        const content = Object.values(accomplishment.content).join("\n\n");
        await Clipboard.setStringAsync(content.trim().length === 0 ? '' : content);
    };

    return (
        <View style={{ height: '100%', marginVertical: Dimensions.get('window').height / 10 }}>
            {/* todo: add badges at top and make filtering happen! */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginBottom: 32, marginLeft: 16, fontSize: 28 }}>Accomplishments</Text>
                <IconButton
                    style={{ marginTop: -12, marginRight: 16 }}
                    onPress={() => {
                        copyToClipboard()
                            .then(() => Toast.show({ type: 'success', text1: 'copied accomplishments to clipboard', swipeable: true }))
                    }
                    }
                    icon={<Icon size={24} color={Colors.text} name="content-copy" />}
                />
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={headerHeight}
            >
                <ScrollView contentContainerStyle={
                    {
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingBottom: 128,
                    }
                }>
                    {
                        loadingAccomplishment ?
                            <Progress.Circle size={40} indeterminate={true} color={Colors.background} borderWidth={3} style={{ alignSelf: 'center', marginTop: '66%' }} /> :
                            GradeLevels.map(gradeLevel =>
                                <View key={gradeLevel.year} style={{ borderWidth: 0.5, borderColor: '#1D1B20', borderRadius: 8, marginVertical: 32, marginHorizontal: 16, padding: 8, paddingVertical: 16 }}>
                                    <View style={{ padding: 8 }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, letterSpacing: 0.5, marginBottom: 8 }}>{gradeLevel.name} year</Text>
                                            {
                                                editYear !== gradeLevel.year &&
                                                <IconButton
                                                    style={{ marginTop: -12 }}
                                                    onPress={() => { toggleEditing(gradeLevel.year) }}
                                                    icon={<Icon size={24} color={Colors.background} name="square-edit-outline" />}
                                                />
                                            }
                                        </View>
                                        <Text style={{ fontFamily: 'Roboto_300Light', marginBottom: 24 }}>During your {gradeLevel.name.toLowerCase()} year, you:</Text>
                                        {
                                            editYear === gradeLevel.year ?
                                                <View>
                                                    <TextInput
                                                        multiline
                                                        //label="Accomplishments"
                                                        variant="outlined"
                                                        value={yearAccomplishmentContent}
                                                        onChangeText={(content) => {
                                                            setYearAccomplishmentContent(content)
                                                        }}
                                                        style={{ marginTop: 16 }}
                                                        // todo: give inner text some top padding, this ain't doing it :(
                                                        inputStyle={{ margin: 8 }}
                                                        color={Colors.background}
                                                    />
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                                                        <Button
                                                            color={Colors.text} tintColor={Colors.background}
                                                            title="Cancel"
                                                            style={{ marginRight: 8 }}
                                                            onPress={() => { toggleEditing(0) }}
                                                        />
                                                        <Button
                                                            color={Colors.background} tintColor={Colors.text}
                                                            title="Save"
                                                            disabled={!yearAccomplishmentContent}
                                                            onPress={async () => {
                                                                await saveAccomplishment()
                                                                    .then(() => toggleEditing(0))
                                                                    .then(() => Toast.show({ type: 'success', text1: 'added!!!!', position: 'bottom', swipeable: true }))
                                                            }}
                                                        />
                                                    </View>
                                                </View> :
                                                <Text style={{ fontFamily: 'Roboto_300Light', marginBottom: 16 }}>{`${accomplishment?.content[gradeLevel.year]}`}</Text>
                                        }
                                    </View>
                                </View>)
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}