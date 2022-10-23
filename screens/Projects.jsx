import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROJECT_URL = adresseIp + "/projet/findAllProjet";
const Projects = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState("");
  const [role, setRole] = React.useState("");

  function fetchProject() {
    axios
      .post(PROJECT_URL)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const role = await AsyncStorage.getItem("role");
        const parrain = await AsyncStorage.getItem("parrain");

        setRole(role);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  React.useEffect(() => {
    getData();
    fetchProject();
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>قائمة المشاريع</Text>
        </View>
        <View style={styles.headerRight}>
          {role != "ROLE_ELEVE" && (
            <TouchableOpacity onPress={() => navigation.navigate("AddProject")}>
              <Entypo name="plus" size={30} color={COLORS.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            paddingBottom: 50,
          }}
        >
          {isLoading == false ? (
            <>
              {data.map((projet, index) => (
                <View style={styles.cardContainer} key={index}>
                  <TouchableOpacity
                    style={styles.cardIcons}
                    onPress={() =>
                      navigation.navigate("Projectdesc", {
                        projetId: projet.id,
                        projetTitre: projet.titre,
                        projetDescription: projet.description,
                        projetDomaine: projet.domaine,
                        projetNbMissions: projet.nb_missions,
                        projetGoals: projet.goals,
                        projetMissions: projet.missions,
                      })
                    }
                  >
                    <Entypo name="chevron-left" size={30} color="white" />
                  </TouchableOpacity>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{projet.titre}</Text>
                    <Text style={styles.cardDescription} numberOfLines={1}>
                      {projet.description}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <ActivityIndicator size="large" color="#00ff00" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Projects;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFE",
    height: "100%",
    width: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  cardContainer: {
    backgroundColor: "#59ACF5",
    height: 100,
    marginHorizontal: 5,
    paddingRight: 30,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    flexDirection: "row",
  },
  scrollView: {
    height: windowHeight,
    width: windowWidth,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  cardDescription: {
    fontSize: 15,
    color: "#fff",
  },
  cardText: {
    justifyContent: "center",
    width: "80%",
  },
  cardIcons: {
    backgroundColor: "#FECF3A",
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    width: 40,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    width: 40,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: 20,
  },
});
