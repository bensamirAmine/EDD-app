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
  Dimensions,
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
import Icon from "react-native-vector-icons/MaterialIcons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const EditUser = ({ navigation, route }) => {
  const { userId, unom, uprenom, uemail, uphone, upassword, uecole } =
    route.params;
  const { width, height } = useWindowDimensions();
  const [nom, setNom] = React.useState(unom);
  const [prenom, setPrenom] = React.useState(uprenom);
  const [email, setEmail] = React.useState(uemail);
  const [password, setPassword] = React.useState("");
  const [npassword, setnPassword] = React.useState("");
  const [ecole, setEcole] = React.useState(uecole);
  const [telephone, setTelephone] = React.useState(uphone.toString());
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
  const EDIT_USER_URL = adresseIp + "/user/editUser";
  const storeData = async (nom, prenom, id, email, phone, ecole) => {
    try {
      console.log("test storedata");
      await AsyncStorage.setItem("nom", nom);
      await AsyncStorage.setItem("prenom", prenom);
      const jsonValue = JSON.stringify(id);

      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("ecole", ecole);
      await AsyncStorage.setItem("telephone", phone.toString());
      await AsyncStorage.setItem("id", jsonValue);
      const value = await AsyncStorage.getItem("id");
      console.log("value", value);

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
        if (value == userId) {
          storeData(nom, prenom, userId, email, telephone, ecole);
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (e) {
      console.log(e);
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
  function fetchEdit() {
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
    } else {
      let formdata = new FormData();
      formdata.append("userId", userId);
      formdata.append("nom", nom);
      formdata.append("prenom", prenom);
      formdata.append("telephone", telephone);
      formdata.append("ecole", ecole);
      formdata.append("email", email);
      formdata.append("password", password);
      if (image.length > 0) {
        formdata.append("image", {
          uri: image[0].uri,
          name: image[0].filename,
          type: "image/png", // This is important for Android!!
        });
      }
      axios({
        url: EDIT_USER_URL,
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
          getData();
          setIsLoading(false);
          navigation.goBack();
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>تعديل معطيات المستخدم</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <ScrollView>
        <View style={styles.titleCardContainer}>
          <View style={styles.titleCardText}>
            <Text style={styles.titleCardTitle}>{uprenom + " " + unom}</Text>
            <Text style={styles.titleCardDescription}>
              قم بادخال المعلومات الجديدة
            </Text>
          </View>
        </View>
        <View style={styles.logoContainer}>
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
              placeholder="كلمة مرور جديدة"
              style={[styles.input]}
              value={password}
              onChangeText={(e) => setPassword(e)}
              secureTextEntry
            />
            <EvilIcons name="lock" size={23} />
          </View>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
            }}
            onPress={() => setOpenImage(!openImage)}
          >
            <Text
              style={{ color: "#2585F7", fontSize: 18, fontWeight: "bold" }}
            >
              تغيير الصورة
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
            onPress={() => fetchEdit()}
          >
            <Text style={styles.buttonText}>تأكيد</Text>
            {!hideLoading && <ActivityIndicator size="small" color="#00ff00" />}
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
    marginBottom: 50,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  bg: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
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
  titleCardContainer: {
    height: windowHeight * 0.15,
    width: windowWidth - 20,
    marginHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  titleCardText: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  titleCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
  },
  titleCardDescription: {
    fontSize: 15,
    color: "#fff",
  },
});
export default EditUser;
