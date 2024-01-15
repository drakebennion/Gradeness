import { AppBar, Icon, IconButton, ListItem } from "@react-native-material/core";
import { Image, View } from "react-native";
import { styles } from "../styles";

const assetsPath = '../../assets';

const ninth = require(`${assetsPath}/9th.png`);
const tenth = require(`${assetsPath}/10th.png`);
const eleventh = require(`${assetsPath}/11th.png`);
const twelfth = require(`${assetsPath}/12th.png`);

const makeImage = (source) => {
    return (
        <Image style={{ height: 48, width: 48 }} source={source}/>
    );
}

const roadmapGradeLevels = [
    { 
        title: 'Freshman', 
        secondaryText: 'Begin your story', 
        image: makeImage(ninth)
    },
    { 
        title: 'Sophomore', 
        secondaryText: 'Develop your story', 
        image: makeImage(tenth)
    },
    { 
        title: 'Junior', 
        secondaryText: 'Refine your story', 
        image: makeImage(eleventh)
    },
    { 
        title: 'Senior', 
        secondaryText: 'Tell your story', 
        image: makeImage(twelfth)
    },
];

export const RoadmapScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <AppBar 
          contentContainerStyle={styles.appBar}
          centerTitle
          title="Your roadmap"
          color="#365a75"
          leading={props => (
            <IconButton icon={props => <Icon name="menu" {...props} />} {...props} />
          )}
        />
        {
            roadmapGradeLevels.map(level => 
                <ListItem
                    key={level.title}
                    title={level.title}
                    secondaryText={level.secondaryText}
                    leading={level.image}
                    trailing={<Icon size={24} name="chevron-right"/>}
                    onPress={() => navigation.navigate('GradeLevel')}
                />
            )
        }
      </View>
    );
  }