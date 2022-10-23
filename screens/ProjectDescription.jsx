import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StatusBar,
  Alert
} from "react-native";
import React from "react";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DELETE_PROJECT_URL = adresseIp + "/projet/deleteProjet";
const ProjectDescription = ({ route, navigation }) => {
  const {
    projetId,
    projetTitre,
    projetDescription,
    projetNbMissions,
    projetDomaine,
    projetGoals,
    projetMissions,
  } = route.params;
  const [role, setRole] = React.useState("");
  const createTwoButtonAlert = (id) =>
  Alert.alert("", "هل ترغب بحذف هذا المشروع ؟", [
    {
      text: "إلغاء",
      onPress: () => console.log("إلغاء"),
      style: "cancel",
    },
    { text: "حذف المشروع", onPress: () => fetchDeleteProject(id) },
  ]);
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
    
  });
  function fetchDeleteProject(id) {
    axios
      .post(DELETE_PROJECT_URL, {
        projetId: id,
      })
      .finally(() => {
        fetchEleve();
      });
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
          <Text style={styles.headerText}>معلومات عن المشروع</Text>
        </View>
        <View style={styles.headerRight}>
        {role != "ROLE_ELEVE" && (
          <TouchableOpacity
            onPress={() => createTwoButtonAlert(projetId)}
          >
            <Entypo name="trash" size={17} color={COLORS.black} />
          </TouchableOpacity>
        )}
        </View>
      </View>

      <ScrollView
        style={{
          width: windowWidth,
          height: windowHeight,
        }}
      >
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.cardIcons}>
            <Text style={styles.missionsCount}>{projetNbMissions}</Text>
          </TouchableOpacity>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{projetTitre}</Text>
            <Text style={styles.cardDescription} numberOfLines={1}>
              {projetDomaine}
            </Text>
          </View>
        </View>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>عن المشروع</Text>
        </View>
        <View style={styles.cardAboutProject}>
          <Text style={styles.cardAboutProjectDescription}>
            {projetDescription}
          </Text>
        </View>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>أهداف المشروع</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {projetGoals.map((goal, index) => (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalCardText}>
                <Text style={styles.goalCardTitle}>{goal.txt}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>المهام</Text>
        </View>
        <ScrollView
          horizontal
          style={{
            width: windowWidth,
            height: 300,
          }}
        >
          {projetMissions.map((mission, index) => (
            <View key={index} style={styles.missionCard}>
              <View style={styles.missionCardImage}>
                <Image
                  source={{
                    uri:
                      "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                      mission.image,
                  }}
                  style={styles.missionCardImage}
                />
                <TouchableOpacity
                  style={styles.missionCardIcon}
                  onPress={() =>
                    navigation.navigate("Missiondesc", {
                      titre: mission.titre,
                      starts: new Date(mission.start_at).toLocaleDateString(),
                      ends: new Date(mission.ends_at).toLocaleDateString(),
                      image: mission.image,
                      description: mission.description,
                      mId: mission.id,
                      users: mission.missionUsers1,
                    })
                  }
                >
                  <Entypo name="plus" size={40} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.missionCardBody}>
                <Text style={styles.missionCardTitle}>{mission.titre}</Text>
                <View style={styles.missionCardDates}>
                  <View style={styles.missionCardStartDate}>
                    <Text style={styles.missionCardStartDateText}>
                      بداية المهمة
                    </Text>
                    <Text style={styles.missionCardStartDateText}>
                      {new Date(mission.start_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.missionCardEndDate}>
                    <Text style={styles.missionCardEndDateText}>
                      نهاية المهمة
                    </Text>
                    <Text style={styles.missionCardEndDateText}>
                      {new Date(mission.ends_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.transparentBlack3,
              height: 150,
              width: windowWidth - 100,
              marginHorizontal: 10,
              marginTop: 30,
              borderRadius: 10,
              padding: 0,
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
            }}
            onPress={() =>
              navigation.navigate("AddTask", {
                projetId: projetId,
              })
            }
          >
            <Icon name="add-circle-outline" size={60} color={COLORS.white} />
            <Text
              style={{
                color: "white",
              }}
            >
              أضف مهمة جديدة
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.missionCard}>
            <View style={styles.missionCardImage}>
              <Image
                source={require("../assets/aa.png")}
                style={styles.missionCardImage}
              />
              <TouchableOpacity style={styles.missionCardIcon}>
                <Entypo name="plus" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.missionCardBody}>
              <Text style={styles.missionCardTitle}>المهمة الأولى</Text>
              <View style={styles.missionCardDates}>
                <View style={styles.missionCardStartDate}>
                  <Text style={styles.missionCardStartDateText}>
                    بداية المهمة
                  </Text>
                  <Text style={styles.missionCardStartDateText}>
                    09/09/2019
                  </Text>
                </View>
                <View style={styles.missionCardEndDate}>
                  <Text style={styles.missionCardEndDateText}>
                    نهاية المهمة
                  </Text>
                  <Text style={styles.missionCardEndDateText}>10/10/2019</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.missionCard}>
            <View style={styles.missionCardImage}>
              <Image
                source={require("../assets/aa.png")}
                style={styles.missionCardImage}
              />
              <TouchableOpacity style={styles.missionCardIcon}>
                <Entypo name="plus" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.missionCardBody}>
              <Text style={styles.missionCardTitle}>المهمة الأولى</Text>
              <View style={styles.missionCardDates}>
                <View style={styles.missionCardStartDate}>
                  <Text style={styles.missionCardStartDateText}>
                    بداية المهمة
                  </Text>
                  <Text style={styles.missionCardStartDateText}>
                    09/09/2019
                  </Text>
                </View>
                <View style={styles.missionCardEndDate}>
                  <Text style={styles.missionCardEndDateText}>
                    نهاية المهمة
                  </Text>
                  <Text style={styles.missionCardEndDateText}>10/10/2019</Text>
                </View>
              </View>
            </View>
          </View> */}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectDescription;
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
    marginHorizontal: 10,
    paddingRight: 30,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    flexDirection: "row",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  cardDescription: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    lineHeight: 25,
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
  missionsCount: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    backgroundColor: COLORS.orangeLightProject,
    height: 40,
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: "2.5%",
  },
  sectionTitleText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  missionCard: {
    backgroundColor: "#fff",
    height: 200,
    width: windowWidth - 100,
    marginHorizontal: 10,
    marginTop: 50,
    borderRadius: 10,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  missionCardImage: {
    height: 150,
    width: "100%",
    borderRadius: 15,
  },
  missionCardBody: {
    width: "100%",
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  missionCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  missionCardDates: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  missionCardStartDate: {
    width: "45%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  missionCardEndDate: {
    width: "45%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  missionCardStartDateText: {
    fontSize: 15,
    color: "#000",
  },
  missionCardEndDateText: {
    fontSize: 15,
    color: "#000",
  },
  missionCardIcon: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#FECF3A",
  },
  goalCard: {
    backgroundColor: COLORS.blueLightProject,
    width: windowWidth - 100,
    height: 100,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    flexDirection: "row",
  },
  goalCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  goalCardText: {
    justifyContent: "center",
    width: "80%",
  },
  goalCardIcons: {
    backgroundColor: "#FECF3A",
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardAboutProject: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingRight: 30,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
    flexDirection: "row",
  },
  cardAboutProjectDescription: {
    fontSize: 15,
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 25,
  },
});
