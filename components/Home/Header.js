import React from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import IonIcons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../config/colors";
function Header({ navigation, isOpen, isLoggedIn }) {
  const [userId, setUserId] = React.useState("");
  const [showMenu, setShowMenu] = React.useState(false);
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const image = await AsyncStorage.getItem("image");
  
        setUserId(id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 5,
      }}
    >
      {/*Logo*/}

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 55,
          height: "100%",
        }}
      >
        <Image
          style={styles.headerLogo}
          source={require("../../assets/logo.jpg")}
        />
      </View>

      {/*Right*/}

      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 20,
          borderColor: COLORS.secondary,
          position: "absolute",
        }}
        onPress={() => {
          navigation.openDrawer();
          isOpen = !isOpen;
        }}
      >
        <SimpleLineIcons name="menu" size={32} color={COLORS.primary} />
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 20,
          borderColor: COLORS.secondary,
        }}
        onPress={() => navigation.navigate("Profil", {profileId: userId,profileName: null,profileImage: null})}
      >
        <Image
          style={{ width: 35, height: 35 }}
          source={require("../../assets/ressources.png")}
        />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 55,
    resizeMode: "contain",
    marginTop: 10,
  },
});
export default Header;
