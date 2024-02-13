import { Button, Text, TextInput } from "@react-native-material/core"
import { ScrollView, View } from "react-native"
import { Colors, GradeLevels } from "../Constants"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useAuthentication } from "../utils/hooks/useAuthentication"
import { groupBy, toSorted } from "../utils/array"

export const AccomplishmentScreen = ({ navigation }) => {
    const db = getFirestore()
    const { user } = useAuthentication()
    const [accomplishments, setAccomplishments] = useState({})
    const [loadingAccomplishments, setLoadingAccomplishments] = useState(true)

    // todo: pull addaccomplishments into its own component
    const [addAccomplishments, setAddAccomplishments] = useState({});
    const [shouldRefetch, setShouldRefetch] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (user && shouldRefetch) {
                    const q = query(collection(db, 'accomplishments'),
                        where('userId', '==', user.uid));
                    const accomplishments = await getDocs(q)
                    // todo: still handle firestore typing!
                    const accomplishmentsData = accomplishments.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    const accomplishmentsByYear = groupBy(accomplishmentsData, 'year')
                    // todo: need handling for if there are no accomplishments at all, plus network error handling
                    setAccomplishments(accomplishmentsByYear)
                    setLoadingAccomplishments(false)
                    setShouldRefetch(false)
                }
            }

            fetchData().catch(console.error)
        }, [user, shouldRefetch])
    )

    const saveAccomplishmentForYear = async (year: number) => {
        if (!addAccomplishments[year]) return;
        const accomplishmentToAdd = addAccomplishments[year];
        const accomplishmentEntity = {
            accomplishment: accomplishmentToAdd,
            year,
            userId: user.uid,
            createdAt: Date.now(),
            createdBy: user.uid,
            updatedAt: Date.now(),
            updatedBy: user.uid
        }
        await addDoc(collection(db, 'accomplishments'), accomplishmentEntity).catch(console.error)

        setAddAccomplishments({ ...addAccomplishments, [year]: '' });
    }

    // TODO; actually want to split this into different components so they can each handle
    // refresh individually :p 
    return (
        <View>
            {/* todo: add badges at top and make filtering happen! */}
            <Text style={{ fontFamily: 'Roboto_400Regular', color: Colors.text, marginTop: 64, marginBottom: 32, marginLeft: 16, fontSize: 28 }}>Accomplishments</Text>
            <ScrollView contentContainerStyle={
                {
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 128
                }
            }>
                {
                    GradeLevels.map(gradeLevel =>
                        loadingAccomplishments ?
                            <Text style={{ fontFamily: 'Roboto_400Regular' }} key={gradeLevel.year}>Loading...</Text> :
                            <View key={gradeLevel.year} style={{ borderWidth: 0.5, borderColor: '#1D1B20', borderRadius: 8, marginVertical: 32, marginHorizontal: 16, padding: 8, paddingVertical: 16 }}>
                                <View style={{ padding: 8 }}>
                                    <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 16, letterSpacing: 0.5, marginBottom: 8 }}>{gradeLevel.name} year</Text>
                                    <Text style={{ fontFamily: 'Roboto_300Light', marginBottom: 24 }}>During your {gradeLevel.name.toLowerCase()} year, you:</Text>
                                    {
                                        // todo: how do we actually want to sort them?
                                        // todo: empty list = show message to add accomplishments
                                        toSorted(accomplishments?.[gradeLevel.year], (a, b) => a.createdAt - b.createdAt)?.map(({ id, accomplishment }) =>
                                            <Text style={{ fontFamily: 'Roboto_300Light', marginBottom: 16 }} key={id}>{accomplishment}</Text>
                                        )
                                    }
                                    <Text style={{ marginTop: 16 }}>Capture your accomplishments</Text>
                                    <TextInput
                                        label="Accomplishments"
                                        variant="outlined"
                                        value={addAccomplishments[gradeLevel.year]}
                                        onChangeText={(gradeLevelAccomplishment) => {
                                            setAddAccomplishments({ ...addAccomplishments, [gradeLevel.year]: gradeLevelAccomplishment })
                                        }}
                                        style={{ marginTop: 12 }}
                                    />
                                    <Button disabled={!addAccomplishments[gradeLevel.year]} color={Colors.highlight2} style={{ alignSelf: 'flex-end', marginTop: 8 }} title="Save" onPress={() => saveAccomplishmentForYear(gradeLevel.year).then(() => setShouldRefetch(true))} />
                                </View>
                            </View>)
                }
            </ScrollView>
        </View>
    )
}