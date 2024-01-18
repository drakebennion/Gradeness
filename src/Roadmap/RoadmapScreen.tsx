import { AppBar, Icon, IconButton, ListItem } from "@react-native-material/core";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { GradeLevels } from "./Repository";

const roadmapGradeLevels = GradeLevels;

export const RoadmapScreen = ({ navigation }) => {
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
        />
        {
            roadmapGradeLevels.map(level => 
                <ListItem
                    key={level.year}
                    title={level.name}
                    secondaryText={level.objective}
                    leading={makeIcon(level)}
                    trailing={<Icon size={24} name="chevron-right"/>}
                    onPress={() => navigation.navigate('GradeLevel')}
                />
            )
        }
      </View>
    );
  }

  const makeIcon = (gradeLevel) => {
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
                color: getColorForYear(gradeLevel.year),
                fontSize: 36,
            }}>{ gradeLevel.year }
        </Text>
        </View>
    );
  }

  const getColorForYear = (year: number) => {
    if (year === 9) return '#4AF466';
    if (year === 10) return '#F6629D';
    if (year === 11) return '#3CD0F5';
    if (year === 12) return '#FCD411';
    return '#4AF466';
  }