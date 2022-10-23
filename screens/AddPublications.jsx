import React from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { adresseIp } from "../config/constants";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";
import SectionTitle from "../components/SectionTitle";
import { COLORS } from "../config/colors";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/MaterialIcons";
// import * as ImagePicker from "expo-image-picker";
// import ImagePicker from "react-native-image-crop-picker";
import { ImageBrowser } from "expo-image-picker-multiple";

const MISSIONS_ELEVE_URL =
  adresseIp + "/missionUser/parrainMissionsforEleveforPublication";
const MISSIONS_URL = adresseIp + "/missionUser/mesMissions";
const ADD_PUB_URL = adresseIp + "/publication/newPublication";
const AddPublications = ({ navigation, route }) => {
  let width = Dimensions.get("window").width;
  let height = Dimensions.get("window").height;
  const [images, setImages] = React.useState([]);
  const [role, setRole] = React.useState("");
  const [parrain, setParrain] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoading2, setIsLoading2] = React.useState(true);
  const [missions, setMissions] = React.useState([]);
  const [selectedMission, setSelectedMission] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [formdatastate, setFormdatastate] = React.useState(new FormData());
  const [isError, setIsError] = React.useState(false);
  const [hideLoading, setHideLoading] = React.useState(true);
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
      // console.log(e);
    }
  };
  React.useEffect(() => {
    getData();
    fetchMissions();
  });
  React.useEffect(() => {
    if (!isLoading2) {
      if (!isError) {
        console.log("iserror ->", isError);
        navigation.navigate("Home");
      } else {
        console.log("->", isError);
      }
    }
  }, [isError]);
  function addPub() {
    setHideLoading(false);
    let formdata = new FormData();
    formdata.append("missionId", selectedMission);
    formdata.append("userId", userId);
    formdata.append("description", description);
    formdata.append("type", "image");
    for (let i = 0; i < image.length; i++) {
      formdata.append("image[]", {
        uri: image[i].uri,
        name: image[i].filename,
        type: "image/png", // This is important for Android!!
      });
      console.log("mission id : " + selectedMission);
      console.log("user id : " + userId);
      console.log("img : " + image[0]);
    }
    axios({
      url: ADD_PUB_URL,
      method: "POST",
      data: formdata,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("resp : " + response.data);
      })
      .finally(() => {
        setIsLoading2(false);
        navigation.navigate("Home");
      })
      .catch(function (error) {
        setHideLoading(true);
        setIsError(true);
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }
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
        });
      // .catch((error) => console.log(error.response));
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
        });
      // .catch((error) => console.log(error.response));
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
          <Text style={styles.headerText}>إضافة منشور</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              addPub();
            }}
          >
            {!hideLoading ? (
              <ActivityIndicator size="small" color="#00ff00" />
            ) : (
              <Entypo name="plus" size={30} color={COLORS.black} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            paddingTop: 30,
          }}
        >
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            قم باختيار المهمة :
          </Text>
          {!isLoading ? (
            <Picker
              selectedValue={selectedMission}
              style={{
                width: width - 50,
                marginLeft: 25,
              }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMission(itemValue)
              }
            >
              {missions.map((mission, index) => (
                <Picker.Item
                  key={index}
                  label={mission.mission.titre}
                  value={mission.mission.id}
                />
              ))}
            </Picker>
          ) : (
            <ActivityIndicator size="small" color="#00ff00" />
          )}
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            نص المنشور :
          </Text>
          <TextInput
            placeholder="هل قمت بإنجاز مهمة جديدة ؟"
            //   placeholderStyle={styles.textInput}
            multiline
            placeholderStyle={{ fontFamily: "AnotherFont", borderColor: "red" }}
            style={{
              height: 170,
              fontSize: 18,
              paddingHorizontal: 20,
              borderColor: COLORS.transparentBlack1,
              borderWidth: 1,
              marginHorizontal: 10,
              marginBottom: 25,
              borderRadius: 15,
            }}
            value={description}
            onChangeText={(e) => setDescription(e)}
          />
        </View>
        <Text
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          قم باضافة صور :
        </Text>
        {/* {image != "" && (
          <Text style={{ fontSize: 18, color: "black" }}>
            {image[0].filename}
          </Text>
        )} */}
        <View style={{ height: 350, backgroundColor: "white" }}>
          {/* <Text onPress={() => pickImage()}>testImage</Text> */}
          <ImageBrowser
            max={50}
            onChange={(num, onSubmit) => {
              console.log(num);
              onSubmit();
            }}
            callback={(callback) => {}}
            imagesFromPhone={(callback) => {
              console.log("callback -> " + callback);
              let formData = new FormData();
              formData.append("image", callback[0]);
              setFormdatastate(formData);
              setImage(callback);
            }}
          />
        </View>
        {/* {SyncStorage.get("foo") != null && SyncStorage.get("foo") != [] && (
        <Text>{SyncStorage.get("assets")}</Text>
      )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPublications;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: "100%",
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    height: 45,
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
