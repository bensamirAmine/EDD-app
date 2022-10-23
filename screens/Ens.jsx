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
  ActivityIndicator
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
const ENS_URL = adresseIp + "/user/findallENSEIGNANT";
const DELETE_USER_URL = adresseIp + "/user/delete";

const Ens = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState("");
  const createTwoButtonAlert = (id) =>
    Alert.alert("", "هل ترغب بحذف هذا المعلم ؟", [
      {
        text: "إلغاء",
        onPress: () => console.log("إلغاء"),
        style: "cancel",
      },
      { text: "حذف المعلم", onPress: () => fetchDeleteEns(id) },
    ]);

  function fetchEns() {
    axios
      .post(ENS_URL)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  function fetchDeleteEns(id) {
    axios
      .post(DELETE_USER_URL, {
        userId: id,
      })
      .finally(() => {
        fetchEns();
      })
      .catch((error) => console.log(error));
  }

  React.useEffect(() => {
    fetchEns();
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
          <Text style={styles.headerText}>قائمة المستخدمين</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        {isLoading == false ? (
          <>
            {data.map((ens, index) => (
              <View style={styles.friendListItem} key={index}>
                <View style={styles.friendListItemLeft}>
                  <TouchableOpacity
                    style={styles.delete}
                    onPress={() => createTwoButtonAlert(ens.id)}
                  >
                    <Entypo name="cross" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.edit}
                    onPress={() => navigation.navigate("editUser",{
                      uuserId: ens.id,
                      unom: ens.nom,
                      uprenom: ens.prenom,
                      uemail:ens.email,
                      uphone: ens.telephone,
                      upassword:ens.password,
                      uecole: ens.ecole
                    })}
                  >
                    <Entypo name="edit" size={15} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.friendListItemCenter}>
                  <Text style={styles.friendListItemText}>
                    {ens.nom} {ens.prenom}
                  </Text>
                </View>
                <View style={styles.friendListItemRight}>
                  <Image
                    source={require("../assets/2.png")}
                    style={styles.friendListAvatar}
                  />
                </View>
              </View>
            ))}
          </>
        ) : (
          <ActivityIndicator size="large" color="#00ff00" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Ens;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFE",
    height: "100%",
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
  userCardContainer: {
    height: 100,
    width: windowWidth - 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLORS.orangeProject,
    borderRadius: 10,
  },

  userCardText: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  userCardTitle: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userCardLink: {
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 10,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 70,
    backgroundColor: COLORS.orangeLightProject,
  },
  scrollView: {
    height: windowHeight,
    width: windowWidth,
  },
  friendListItem: {
    height: 100,
    width: windowWidth - 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  friendListItemLeft: {
    height: "70%",
    width: "20%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  friendListItemCenter: {
    height: "100%",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  friendListItemRight: {
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  friendListItemText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "bold",
    marginBottom: 10,
  },
  friendListAvatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.white,
  },
  delete: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: COLORS.orangeProject,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  edit: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: COLORS.blueLightProject,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
