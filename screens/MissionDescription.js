import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import axios from "axios";
import { adresseIp } from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS } from "../config/colors";

import Icon from "react-native-vector-icons/MaterialIcons";

import { Fontisto } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ADD_MISSIONi_URL = adresseIp + "/missionUser/newMissionUser";
const MissionDescription = ({ navigation, route }) => {
  const [affected, setAffected] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [role, setRole] = React.useState("");
  const { titre, starts, ends, description, image, mId, users } = route.params;

  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const role = await AsyncStorage.getItem("role");
        const parrain = await AsyncStorage.getItem("parrain");
        // setParrain(parrain);
        setUserId(id);
        setRole(role);
      }
    } catch (e) {
      console.log(e);
    }
  };

  function addMission() {
    setAffected(true);
    axios
      .post(ADD_MISSIONi_URL, {
        userId: userId,
        missionId: mId,
      })
      .then((response) => {
        setAffected(true);
      })
      .finally(() => {

        setAffected(true);
        console.log(affected);
      })
      .catch((error) => console.log(error.response));
  }
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>معلومات المهمة</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <ScrollView>
        <View style={styles.missionDescriptionContainer}>
          <View style={styles.missionTitle}>
            <Text style={styles.missionTitleText}>{titre}</Text>
          </View>
          <View style={styles.postedByHeader}>
            <View style={styles.postedByHeaderLeft}>
              <Text style={styles.postDate}>إلى : {ends}</Text>
              <Fontisto
                name="date"
                style={{
                  paddingHorizontal: 10,
                }}
                size={15}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.postedByHeaderLeft}>
              <Text style={styles.postDate}>من : {starts}</Text>
              <Fontisto
                name="date"
                style={{
                  paddingHorizontal: 10,
                }}
                size={15}
                color={COLORS.primary}
              />
            </View>
          </View>
          <View style={styles.missionImage}>
            <Image
              source={{
                uri:
                  "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                  image,
              }}
              style={styles.missionImage}
            />
          </View>
          <View style={styles.missionDescription}>
            <Text style={styles.missionDescriptionText}>{description}</Text>
            {role != "ROLE_ELEVE" && (
            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                {users.some((user) => user["users"].id == userId) ||
                affected ? (
                  <TouchableOpacity style={styles.footerLeftButton2}>
                    <Text style={styles.footerLeftButtonText}>
                      أنت مشترك بهذه المهمة
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.footerLeftButton}
                    onPress={() => {
                      addMission();
                    }}
                  >
                    <Text style={styles.footerLeftButtonText}>
                      اشترك في المهمة
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.footerRight}>
                <TouchableOpacity
                  style={styles.footerRightButton}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.footerRightButtonText}>خروج</Text>
                </TouchableOpacity>
              </View>
            </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MissionDescription;

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
  sectionTitleContainer: {
    height: 40,
    width: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingLeft: 10,
  },
  missionDescriptionContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
    padding: 10,
  },
  missionTitle: {
    height: 40,
    width: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  missionTitleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.black,
  },
  postedByHeader: {
    height: 40,
    width: "100%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  postedByHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postedByHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginLeft: 10,
  },
  postedByHeaderText: {
    fontSize: 15,
    color: COLORS.black,
  },
  postDate: {
    fontSize: 15,
    color: COLORS.black,
  },
  missionImage: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  missionDescription: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
    padding: 10,
  },
  missionDescriptionText: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 10,
    letterSpacing: 1,
    lineHeight: 25,
    textAlign: "justify",
  },
  footer: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    width: "60%",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    width: "40%",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLeftButton: {
    height: 50,
    width: "100%",
    borderRadius: 50,
    backgroundColor: COLORS.orangeProject,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLeftButton2: {
    height: 50,
    width: "100%",
    borderRadius: 50,
    backgroundColor: COLORS.orangeLightProject,
    justifyContent: "center",
    alignItems: "center",
  },
  footerRightButton: {
    height: 50,
    width: "90%",
    borderRadius: 50,
    backgroundColor: COLORS.transparentBlack3,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLeftButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerRightButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
});
