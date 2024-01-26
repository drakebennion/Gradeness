import { AppBar, Button, Icon, IconButton, ListItem } from "@react-native-material/core";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { GradeLevels } from "./Repository";
import { getAuth, signOut } from "firebase/auth";
import { doDataImport } from "../utils/init/db";
import { getColorForYear, getGradeLevelNameForYear, getGradeLevelObjectiveForYear } from "../utils/style";

const roadmapGradeLevels = GradeLevels;

export const RoadmapScreen = ({ navigation }) => {
  const auth = getAuth();

    return (
      <View style={styles.container}>
        <AppBar 
          contentContainerStyle={styles.appBar}
          centerTitle
          title="Roadmap"
          color="#1C222E"
          leading={props => (
            <IconButton icon={props => <Icon name="menu" {...props} />} {...props} />
          )}
          trailing={ props => (
            <Button title="Log out" onPress={() => signOut(auth)} {...props}/>
          )}
        />
        {
            roadmapGradeLevels.map(({ year, objective }) => 
                <ListItem
                    key={year}
                    title={getGradeLevelNameForYear(year)}
                    secondaryText={getGradeLevelObjectiveForYear(year)}
                    leading={makeIcon(year)}
                    trailing={<Icon size={24} name="chevron-right"/>}
                    onPress={() => navigation.navigate('GradeLevel', { year })}
                />
            )
        }
        <Button title="IMPORT DATA DRAKE" onPress={doDataImport}/>
      </View>
    );
  }

  const makeIcon = (year) => {
    return (
        <View style={{
            alignItems: 'center',
            backgroundColor: '#1C222E',
            display: 'flex',
            height: 48,
            justifyContent: 'center',
            width: 48,
        }}>
        <Text 
            style={{
                color: getColorForYear(year),
                fontSize: 36,
            }}>{ year }
        </Text>
        </View>
    );
  }