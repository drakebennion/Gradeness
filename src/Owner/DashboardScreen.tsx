import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getCountFromServer,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useCallback, useContext, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../Constants';
import { RoadmapDrawerContext } from '../Contexts';
import { DeleteAccountDialog } from '../Roadmap/DeleteAccountDialog';
import { Text } from '../Typography';
import { useAuthentication } from '../utils/hooks/useAuthentication';

export const DashboardScreen = () => {
  const { user } = useAuthentication();

  const { setDrawerOpen } = useContext(RoadmapDrawerContext);
  const windowHeight = Dimensions.get('window').height;
  const db = getFirestore();
  const [studentsWithActivityCounts, setStudentsWithActivityCounts] = useState(
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const fetchStudents = async () => {
        if (user) {
          return await getDocs(
            collection(db, `userDetails/${user.uid}/students`),
          );
        }
      };

      const fetchStudentActivites = async (
        students: QuerySnapshot<DocumentData, DocumentData>,
      ) => {
        return await Promise.all(
          students.docs.map(async doc => {
            const studentId = doc.id;

            const q = query(
              collection(db, 'activities'),
              where('userId', '==', studentId),
            );

            const snapshot = await getCountFromServer(q);
            return {
              studentId,
              ...doc.data(),
              ...snapshot.data(),
            };
          }),
        );
      };

      fetchStudents()
        .then(fetchStudentActivites)
        .then(setStudentsWithActivityCounts);
    }, [user]),
  );

  return (
    <LinearGradient
      style={{ height: windowHeight }}
      colors={[Colors.background, '#2a354c']}>
      <DeleteAccountDialog />
      <View
        style={{
          height: windowHeight,
          marginHorizontal: 16,
        }}>
        <StatusBar backgroundColor={Colors.background} style="light" />
        <IconButton
          style={{
            marginTop: windowHeight / 15,
            marginBottom: 16,
            marginLeft: -8,
          }}
          iconColor={Colors.text}
          onPress={() => setDrawerOpen(true)}
          icon="menu"
        />
        {studentsWithActivityCounts?.map(({ firstName, count }) => (
          <Text>
            {firstName} has {count} activities
          </Text>
        ))}
      </View>
    </LinearGradient>
  );
};
