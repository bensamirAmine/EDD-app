import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { COLORS } from "../config/colors";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../assets/logo.jpg";
import { adresseIp } from "../config/constants";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LOGIN_URL = adresseIp + "/user/loginUser";

const Login = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [response, setResponse] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [userdata, setUserdata] = React.useState("");
  const [roleuser, setRoleuser] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hideLoading, setHideLoading] = React.useState(true);
  const [runuseeffect, setRunuseeffect] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const storeData = async (
    nom,
    prenom,
    id,
    role,
    parrain,
    image,
    code,
    email,
    phone,
    ecole
  ) => {
    try {
      console.log("test storedata");
      await AsyncStorage.setItem("nom", nom);
      await AsyncStorage.setItem("prenom", prenom);
      const jsonValue = JSON.stringify(id);
      await AsyncStorage.setItem("role", role);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("ecole", ecole);
      await AsyncStorage.setItem("telephone", phone.toString());
      await AsyncStorage.setItem("id", jsonValue);
      const value = await AsyncStorage.getItem("id");
      console.log("value", value);
      await AsyncStorage.setItem("image", image);
      if (role != "ROLE_INSPECTEUR" && role != "ROLE_ADMIN") {
        await AsyncStorage.setItem("parrain", parrain);
      }
      if (role != "ROLE_ELEVE") {
        await AsyncStorage.setItem("code", code);
      }
      if (value != null) {
        navigation.navigate("Home");
      } else {
        console.log("no data");
      }
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("id");
      if (value !== null) {
        navigation.navigate("Home");
      } else {
        console.log("no data");
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (message == "ok") {
      console.log("test message ok");
      distributionData();
    }
    if (message != "ok") {
      setHideLoading(true);
    }
  }, [message, runuseeffect]);

  React.useEffect(() => {
    getData();
    if (!isLoading) {
      console.log("test !isloading");
      messageResult();
    }
  }, [email, password, isLoading, runuseeffect]);

  function fetchUser(email, password) {
    setHideLoading(false);
    axios
      .post(LOGIN_URL, {
        email: email,
        password: password,
      })
      .then((response) => {
        setResponse(response.data);
      })
      .finally(() => {
        setIsLoading(false);
        setHideLoading(true);
        setRunuseeffect(!runuseeffect);
      })
      .catch((error) => console.log(error.response));
  }
  function messageResult() {
    console.log("test setmessage result");
    setMessage(response.message);
  }

  function distributionData() {
    setUserdata(response.user);
    setRoleuser(response.user.roles);
    console.log(
      response.user.nom + " " + response.user.prenom + " " + response.user.id
    );
    for (let i = 0; i < response.user.roles.length; i++) {
      if (response.user.roles[i] == "ROLE_INSPECTEUR") {
        storeData(
          response.user.nom,
          response.user.prenom,
          response.user.id,
          "ROLE_INSPECTEUR",
          response.user.parrain,
          response.user.image,
          response.user.code,
          response.user.email,
          response.user.telephone,
          response.user.ecole
        );
      }
      if (response.user.roles[i] == "ROLE_ENSEIGNANT") {
        storeData(
          response.user.nom,
          response.user.prenom,
          response.user.id,
          "ROLE_ENSEIGNANT",
          response.user.parrain,
          response.user.image,
          response.user.code,
          response.user.email,
          response.user.telephone,
          response.user.ecole
        );
      }
      if (response.user.roles[i] == "ROLE_ELEVE") {
        storeData(
          response.user.nom,
          response.user.prenom,
          response.user.id,
          "ROLE_ELEVE",
          response.user.parrain,
          response.user.image,
          null,
          response.user.email,
          response.user.telephone,
          response.user.ecole
        );
      }
      if (response.user.roles[i] == "ROLE_ADMIN") {
        storeData(
          response.user.nom,
          response.user.prenom,
          response.user.id,
          "ROLE_ADMIN",
          response.user.parrain,
          response.user.image,
          response.user.code,
          response.user.email,
          response.user.telephone,
          response.user.ecole
        );
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/bg.png")} style={styles.bg}>
        <View style={styles.logoContainer}>
          <Image
            source={Logo}
            style={[styles.logo, { height: height * 0.3 }]}
            resizeMode="contain"
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="البريد الالكتروني"
              style={styles.input}
              value={email}
              onChangeText={(e) => setEmail(e)}
            />
            <EvilIcons name="user" size={23} />
          </View>
          <View style={styles.inputContainer}>
            <EvilIcons name="eye" size={23} />
            <TextInput
              placeholder="كلمة المرور"
              style={styles.passwordInput}
              value={password}
              onChangeText={(e) => setPassword(e)}
              secureTextEntry
            />
            <EvilIcons name="lock" size={23} />
          </View>
          <TouchableOpacity
            style={{
              height: 20,
              width: width,
              paddingHorizontal: 25,
            }}
            onPress={() => navigation.navigate("Inscription")}
          >
            <Text style={{ fontSize: 16 }}>تسجيل حساب جديد</Text>
          </TouchableOpacity>
          {message != "" && message != "ok" && (
            <View style={{ height: 20 }}>
              <Text style={{ color: "red", fontWeight: "bold" }}>
                {message}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => fetchUser(email, password)}
          >
            <Text style={styles.buttonText}>تسجيل الدخول</Text>
            {!hideLoading && <ActivityIndicator size="small" color="#00ff00" />}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    height: "100%",
    width: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: { alignItems: "center", padding: 20 },
  logo: {
    height: 200,
    width: "70%",
    maxWidth: 500,
  },
  inputContainer: {
    backgroundColor: "#fff",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: "right",
  },
  passwordInput: {
    textAlign: "right",
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  buttonLogin: {
    backgroundColor: COLORS.primary,
    width: "100%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  bg: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default Login;
