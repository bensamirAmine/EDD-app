import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator
} from "react-native";
import React from "react";
import axios from "axios";
import { adresseIp } from "../config/constants";
import { COLORS } from "../config/colors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MISSIONS_ELEVE_URL =
  adresseIp + "/missionUser/parrainMissionsforEleveforPublication";
const MISSIONS_URL = adresseIp + "/missionUser/mesMissions";

const MyMissions = ({ navigation }) => {
  const [images, setImages] = React.useState([]);
  const [role, setRole] = React.useState("");
  const [parrain, setParrain] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [missions, setMissions] = React.useState([]);
  const [selectedMission, setSelectedMission] = React.useState([]);
  const [image, setImage] = React.useState("");

  const [description, setDescription] = React.useState();

  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const role = await AsyncStorage.getItem("role");
        const parrain = await AsyncStorage.getItem("parrain");
        setParrain(parrain);
        setUserId(id);
        setRole(role);
      }
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    getData();
    fetchMissions();
    console.log("parrain",parrain)
  }, [missions]);
  function fetchMissions() {
    if (role != "ROLE_ELEVE") {
      axios
        .post(MISSIONS_URL, {
          userId: userId,
        })
        .then((response) => {
          setMissions(response.data);
        })
        .finally(() => {
          setIsLoading(false);
          setRunuseeffect(!runuseeffect);
        })
        .catch((error) => console.log(error.response));
    }
    if (role == "ROLE_ELEVE") {
      axios
        .post(MISSIONS_ELEVE_URL, {
          parrain: parrain,
        })
        .then((response) => {
          setMissions(response.data);
        })
        .finally(() => {
          setIsLoading(false);
          setRunuseeffect(!runuseeffect);
        })
        .catch((error) => console.log(error.response));
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>قائمة مهمَاتي</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <ScrollView>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>مهماتي</Text>
        </View>
        {!isLoading ? (
          <>
            {missions.map((mission, index) => (
              <View key={index} style={styles.cardContainer}>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{mission.mission.titre}</Text>
                  <View style={styles.cardDates}>
                    <Text style={styles.cardDate}>
                      إلى :{" "}
                      {new Date(mission.mission.start_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.cardDate}>
                      من :{" "}
                      {new Date(mission.mission.ends_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.cardIcons}>
                  <Entypo name="circle" size={30} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : (
          <>
           <ActivityIndicator size="large" color="#00ff00" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyMissions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFE",
    height: "100%",
    width: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  sectionTitle: {
    height: 40,
    width: "100%",
    backgroundColor: COLORS.orangeLightProject,
    justifyContent: "center",
  },
  sectionTitleText: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },

  cardContainer: {
    backgroundColor: "#59ACF5",
    height: 100,
    paddingLeft: 30,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    flexDirection: "row",
    marginVertical: 2,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  cardIcons: {
    backgroundColor: "#FECF3A",
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    justifyContent: "center",
    width: "80%",
  },
  cardDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  cardDate: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
