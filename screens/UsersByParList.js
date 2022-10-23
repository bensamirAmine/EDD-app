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
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { COLORS } from "../config/colors";
import axios from "axios";
import { adresseIp } from "../config/constants";

import Icon from "react-native-vector-icons/MaterialIcons";

import { Fontisto } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ELEVE_URL = adresseIp + "/user/findEleveForEns";
const DELETE_ELEVE_URL = adresseIp + "/user/delete";
const UsersByParList = ({ navigation }) => {
  const [userCode, setUserCode] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userName, setUserName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [code, setCode] = React.useState("");
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const role = await AsyncStorage.getItem("role");
        const code = await AsyncStorage.getItem("code");
        setRole(role);
        setUserName(prenom + " " + nom);
        setCode(code);
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getData();
    fetchEleve();
  }, [users]);
  const createTwoButtonAlert = (id) =>
    Alert.alert("", "هل ترغب بحذف هذا التلميذ ؟", [
      {
        text: "إلغاء",
        onPress: () => console.log("إلغاء"),
        style: "cancel",
      },
      { text: "حذف التلميذ", onPress: () => fetchDeleteEleve(id) },
    ]);
  function fetchEleve() {
    console.log("code", code);
    axios
      .post(ELEVE_URL, {
        code: code,
      })
      .then((response) => {
        setUsers(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function fetchDeleteEleve(id) {
    axios
      .post(DELETE_ELEVE_URL, {
        userId: id,
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
          <Text style={styles.headerText}>قائمة المستخدمين</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.userCardContainer}>
          <View style={styles.userCardText}>
            <Text style={styles.userCardTitle}>{userName}</Text>
            <Text style={styles.userCardLink}>
              قائمة {role == "ROLE_ENSEIGNANT" ? "تلاميذ" : "معلمي"} السيد(ة){" "}
              {userName}
            </Text>
            <Text style={styles.userCardLink}>
              المعرف الخاص بك: {code}
            </Text>
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <>
            {users.map((user, index) => (
              <View key={index} style={styles.friendListItem}>
                <View style={styles.friendListItemLeft}>
                  <TouchableOpacity
                    style={styles.delete}
                    onPress={() => createTwoButtonAlert(user.id)}
                  >
                    <Entypo name="cross" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.edit}
                    onPress={() => navigation.navigate("editUser",{
                      userId: user.id,
                      unom: user.nom,
                      uprenom: user.prenom,
                      uemail:user.email,
                      uphone: user.telephone,
                      upassword:user.password,
                      uecole: user.ecole
                    })}
                  >
                    <Entypo name="edit" size={15} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.friendListItemCenter}>
                  <Text style={styles.friendListItemText}>
                    {user.prenom + " " + user.nom}
                  </Text>
                </View>
                <View style={styles.friendListItemRight}>
                  <Image
                    source={{
                      uri:
                        "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                        user.image,
                    }}
                    style={styles.friendListAvatar}
                  />
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
{
  /* <View key={index} style={styles.friendListItem}>
                <View style={styles.friendListItemLeft}>
                  <TouchableOpacity style={styles.delete}>
                    <Entypo name="cross" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.edit}>
                    <Entypo name="edit" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.friendListItemCenter}>
                  <Text style={styles.friendListItemText}>
                    محمد أمين بن سمير
                  </Text>
                </View>
                <View style={styles.friendListItemRight}>
                  <Image
                    source={require("../assets/2.png")}
                    style={styles.friendListAvatar}
                  />
                </View>
              </View> */
}
export default UsersByParList;

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
    height: 120,
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
    justifyContent: "center",
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
