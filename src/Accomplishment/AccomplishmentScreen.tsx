import { Button, Text, TextInput } from "@react-native-material/core"
import { ScrollView, View } from "react-native"
import { Colors, GradeLevels } from "../Constants"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useAuthentication } from "../utils/hooks/useAuthentication"
import { groupBy } from "../utils/array"

export const AccomplishmentScreen = ({ navigation }) => {
    const db = getFirestore()
    const { user } = useAuthentication()
    const [accomplishments, setAccomplishments] = useState({})
    const [loadingAccomplishments, setLoadingAccomplishments] = useState(true)

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (user) {
                    const q = query(collection(db, 'accomplishments'),
                        where('userId', '==', user.uid));
                    const accomplishments = await getDocs(q)
                    // todo: still handle firestore typing!
                    const accomplishmentsData = accomplishments.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    const accomplishmentsByYear = groupBy(accomplishmentsData, 'year')
                    // todo: need handling for if there are no accomplishments at all, plus network error handling
                    setAccomplishments(accomplishmentsByYear)
                    setLoadingAccomplishments(false)
                    console.log('accomplished!')
                }
            }

            fetchData().catch(console.error)
        }, [user])
    )

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
                            <Text>Loading...</Text> :
                            <View style={{ borderWidth: 0.5, borderColor: '#ccc', borderRadius: 8, marginVertical: 32 }}>
                                <Text>{gradeLevel.name} year</Text>
                                <Text>During your {gradeLevel.name.toLowerCase()} year, you:</Text>
                                {/* todo: fetch accomplishments for this user and year and display 'em */}
                                <TextInput label="Accomplishments" variant="outlined" />
                                <Button title="Save" />
                                {/* todo: allow for adding new accomplishments here wow */}
                                {/* todo: when an accomplishment is saved, should refetch all? hmm */}
                            </View>)
                }
            </ScrollView>
        </View>
    )
}