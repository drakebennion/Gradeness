import { AppBar, Icon, IconButton, ListItem } from "@react-native-material/core";
import { Image, View } from "react-native";
import { styles } from "../styles";

const assetsPath = '../../assets';

const roadmapGradeLevels = [
    { 
        title: 'Freshman', 
        secondaryText: 'Begin your story', 
        image: <Image source={require(`${assetsPath}/9th.png`)}/>
    },
    { 
        title: 'Sophomore', 
        secondaryText: 'Develop your story', 
        image: <Image source={require(`${assetsPath}/10th.png`)}/>
    },
    { 
        title: 'Junior', 
        secondaryText: 'Refine your story', 
        image: <Image source={require(`${assetsPath}/11th.png`)}/>
    },
    { 
        title: 'Senior', 
        secondaryText: 'Tell your story', 
        image: <Image source={require(`${assetsPath}/12th.png`)}/>
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