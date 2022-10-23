import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { ImageBrowser } from "expo-image-picker-multiple";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { COLORS } from "../config/colors";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/logo.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adresseIp } from "../config/constants";
import { Picker } from "@react-native-picker/picker";

const Inscrption = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [ecole, setEcole] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [parrain, setParrain] = React.useState("");
  const [openImage, setOpenImage] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [formDataState, setFormDataState] = React.useState(new FormData());
  const [isLoading, setIsLoading] = React.useState(true);
  const [Enable, setEnable] = React.useState("متفقد");
  const [response, setResponse] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [runuseeffect, setRunuseeffect] = React.useState(false);

  const [hideLoading, setHideLoading] = React.useState(true);
  const INSCRI_INSPECTEUR_URL = adresseIp + "/user/newInspecteur";
  const INSCRI_ENS_URL = adresseIp + "/user/newEnseignant";
  const INSCRI_ELEVE_URL = adresseIp + "/user/newEleve";

  async function serverResp(blablablavar) {
    setHideLoading(false);
    let response = await fetch(INSCRI_INSPECTEUR_URL, {
      method: "post",
      body: blablablavar,
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    })
      .then((response) => {
        setResponse(response.user);
        setMessage(response.message);
      })
      .finally(() => {
        setIsLoading(false);
        navigation.navigate("Login");
      })
      .catch(function (error) {
        setIsError(true);
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }
  const storeData = async (nom, prenom, id, role) => {
    try {
      await AsyncStorage.setItem("nom", nom);
      await AsyncStorage.setItem("prenom", prenom);
      const jsonValue = JSON.stringify(id);
      await AsyncStorage.setItem("id", jsonValue);
      await AsyncStorage.setItem("role", role);
    } catch (e) {
      // saving error
    }
  };
  React.useEffect(() => {
    if (!isLoading) {
      if (!isError) {
        console.log("iserror ->", isError);
        navigation.navigate("Login");
      } else {
        console.log("->", isError);
      }
    }
  }, [isError]);
  function fetchInscription() {
    setHideLoading(false);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (prenom == "") {
      setHideLoading(true);
      setMessage("الرجاء إدخال الإسم");
    } else if (nom == "") {
      setHideLoading(true);
      setMessage("الرجاء إدخال اللقب");
    } else if (reg.test(email) === false) {
      setHideLoading(true);
      setMessage("الرجاء إدخال بريد الكتروني صحيح");
    } else if (ecole == "") {
      setHideLoading(true);
      setMessage("الرجاء إدخال المؤسسة التربوية");
    } else if (telephone == "") {
      setHideLoading(true);
      setMessage("الرجاء إدخال رقم الهاتف");
    } else if (password == "" || password.length < 8) {
      setHideLoading(true);
      setMessage("الرجاء إدخال كلمة مرور متكونة من 8 حروف على الأقل");
    } else if (image.length == 0) {
      setHideLoading(true);
      setMessage("الرجاء إختيار صورة");
    } else if (Enable != "متفقد" && parrain == "") {
      setHideLoading(true);
      setMessage("الرجاء إدخال معرف المسؤول");
    } else {
      if (Enable == "متفقد") {
        let blablablavar = new FormData();
        blablablavar.append("nom", nom);
        blablablavar.append("prenom", prenom);
        blablablavar.append("telephone", telephone);
        blablablavar.append("ecole", ecole);
        blablablavar.append("email", email);
        blablablavar.append("password", password);
        // for(let i = 0; i < image.length; i++){
        blablablavar.append("image", {
          uri: image[0].uri,
          name: image[0].filename,
          type: "image/png", // This is important for Android!!
        });
        serverResp(blablablavar);
      }
      if (Enable == "معلم") {
        let formdata = new FormData();
        formdata.append("nom", nom);
        formdata.append("prenom", prenom);
        formdata.append("telephone", telephone);
        formdata.append("ecole", ecole);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("parrain", parrain);
        formdata.append("image", {
          uri: image[0].uri,
          name: image[0].filename,
          type: "image/png", // This is important for Android!!
        });
        axios({
          url: INSCRI_ENS_URL,
          method: "POST",
          data: formdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => {
            setResponse(response.data);
            setMessage(response.data.message);
          })
          .finally(() => {
            navigation.navigate("Login");
            setIsLoading(false);
          })
          .catch(function (error) {
            setIsError(true);
            console.log(
              "There has been a problem with your fetch operation: " +
                error.message
            );
          });
      }
      if (Enable == "تلميذ") {
        let formdata = new FormData();
        formdata.append("nom", nom);
        formdata.append("prenom", prenom);
        formdata.append("telephone", telephone);
        formdata.append("ecole", ecole);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("parrain", parrain);
        formdata.append("image", {
          uri: image[0].uri,
          name: image[0].filename,
          type: "image/png", // This is important for Android!!
        });
        axios({
          url: INSCRI_ELEVE_URL,
          method: "POST",
          data: formdata,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        })
          .then((response) => {
            setResponse(response.data);
            setMessage(response.data.message);
          })
          .finally(() => {
            navigation.navigate("Login");
            setIsLoading(false);
          })
          .catch(function (error) {
            setIsError(true);
            console.log(
              "There has been a problem with your fetch operation: " +
                error.message
            );
          });
      }
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/bg.png")} style={styles.bg}>
        <ScrollView>
          <View style={styles.logoContainer}>
            <Image
              source={Logo}
              style={[styles.logo, { height: height * 0.2 }]}
              resizeMode="contain"
            />
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="الاسم"
                style={[styles.input]}
                value={prenom}
                onChangeText={(e) => setPrenom(e)}
              />
              <EvilIcons name="user" size={23} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="اللقب"
                style={[styles.input]}
                value={nom}
                onChangeText={(e) => setNom(e)}
              />
              <EvilIcons name="user" size={23} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="البريد الالكتروني"
                style={[styles.input]}
                value={email}
                onChangeText={(e) => setEmail(e)}
              />
              <Fontisto
                name="email"
                size={15}
                style={{
                  paddingRight: 5,
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="المؤسسة التربوية"
                style={[styles.input]}
                value={ecole}
                onChangeText={(e) => setEcole(e)}
              />
              <Ionicons name="school-outline" size={20} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="رقم الهاتف"
                keyboardType="numeric"
                style={[styles.input]}
                value={telephone}
                onChangeText={(e) => setTelephone(e)}
              />
              <AntDesign name="phone" size={18} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="كلمة المرور"
                style={[styles.input]}
                value={password}
                onChangeText={(e) => setPassword(e)}
                secureTextEntry
              />
              <EvilIcons name="lock" size={23} />
            </View>
            <Picker
              selectedValue={Enable}
              style={{ height: 50, width: 100 }}
              mode={"dialog"}
              onValueChange={(itemValue) => setEnable(itemValue)}
            >
              <Picker.Item label="متفقد" value="متفقد" />
              <Picker.Item label="معلم" value="معلم" />
              <Picker.Item label="تلميذ" value="تلميذ" />
            </Picker>
            {Enable != "متفقد" && (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="معرف المسؤول"
                  style={[styles.input]}
                  value={parrain}
                  onChangeText={(e) => setParrain(e)}
                  secureTextEntry
                />
                <EvilIcons name="lock" size={23} />
              </View>
            )}
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => setOpenImage(!openImage)}
            >
              <Text
                style={{ color: "#2585F7", fontSize: 18, fontWeight: "bold" }}
              >
                إختار الصورة
              </Text>
            </TouchableOpacity>
            {image != "" && (
              <Text style={{ fontSize: 18, color: "black" }}>
                {image[0].filename}
              </Text>
            )}

            {message != "" && message != "ok" && (
              <View style={{ height: 20 }}>
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {message}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={() => fetchInscription()}
            >
              <Text style={styles.buttonText}>تسجيل</Text>
              {!hideLoading && (
                <ActivityIndicator size="small" color="#00ff00" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                backgroundColor: COLORS.orangeProject,
                borderRadius: 5,
              }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.buttonText}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {openImage && (
          <View style={{ height: height, backgroundColor: "black" }}>
            {/* <Text onPress={() => pickImage()}>testImage</Text> */}
            <ImageBrowser
              max={1}
              onChange={(num, onSubmit) => {
                if (num == 1) {
                  setOpenImage(!openImage);
                }
                onSubmit();
              }}
              callback={(callback) => {}}
              imagesFromPhone={(callback) => {
                console.log("callback -> " + callback);
                let formData = new FormData();
                formData.append("assets", callback[0]);
                setFormDataState(formData);
                setImage(callback);
              }}
            />
          </View>
        )}
      </ImageBackground>
    </View>
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
export default Inscrption;
