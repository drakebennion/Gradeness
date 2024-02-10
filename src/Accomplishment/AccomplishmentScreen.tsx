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
            <Text style={{ color: Colors.text, marginTop: 32, fontSize: 36 }}>Accomplishments</Text>
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
                            <Text key={gradeLevel.year}>Loading...</Text> :
                            <View key={gradeLevel.year} style={{ borderWidth: 0.5, borderColor: '#ccc', borderRadius: 8, marginVertical: 32, marginHorizontal: 16, padding: 8, paddingVertical: 16 }}>
                                <Text>{gradeLevel.name} year</Text>
                                <Text>During your {gradeLevel.name.toLowerCase()} year, you:</Text>
                                {
                                    // todo: how do we actually want to sort them?
                                    toSorted(accomplishments?.[gradeLevel.year], (a, b) => a.createdAt - b.createdAt)?.map(({ id, accomplishment }) =>
                                        <Text key={id}>{accomplishment}</Text>
                                    )
                                }
                                <TextInput
                                    label="Accomplishments"
                                    variant="outlined"
                                    value={addAccomplishments[gradeLevel.year]}
                                    onChangeText={(gradeLevelAccomplishment) => {
                                        setAddAccomplishments({ ...addAccomplishments, [gradeLevel.year]: gradeLevelAccomplishment })
                                    }}
                                    style={{ marginTop: 12 }}
                                />
                                <Button title="Save" onPress={() => saveAccomplishmentForYear(gradeLevel.year).then(() => setShouldRefetch(true))} />
                            </View>)
                }
            </ScrollView>
        </View>
    )
}