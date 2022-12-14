import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ImageBrowser } from "expo-image-picker-multiple";

import React from "react";
import axios from "axios";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ADD_RESOURCE = adresseIp + "/ressources/newRessource";

const AddResources = ({ navigation }) => {
  const [selectedCat, setSelectedCat] = React.useState(-1);
  const [titre, setTitre] = React.useState("");
  const [image, setImage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [formdatastate, setFormdatastate] = React.useState(new FormData());
  const [isLoading2, setIsLoading2] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [hideLoading, setHideLoading] = React.useState(true);
  React.useEffect(()=>{
    if(isLoading == false){
      navigation.navigate("Resources")
    }
    },[isLoading])
  function addPub(){
    setHideLoading(false);
    addrs();
  }

  function addrs() {
    
    let formdata = new FormData();
    formdata.append("titre", titre);

    formdata.append("image", {
      uri: image[0].uri,
      name: image[0].filename,
      type: "image/png", // This is important for Android!!
    });
    console.log("img : " + image[0]);

    axios({
      url: ADD_RESOURCE,
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
        setIsLoading(false);
        setHideLoading(true);
        navigation.navigate("Resources");
      }).catch(function (error) {
        setHideLoading(true);
        setIsError(true);
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
    // .catch((error) => console.log(error.response));
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("Resources")}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>?????????? ????????</Text>
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
      <View style={styles.titleCardContainer}>
        <View style={styles.titleCardText}>
          <Text style={styles.titleCardTitle}>?????? ?????????? ??????????</Text>
          <Text style={styles.titleCardDescription}>
            ???? ???????????? ?????????????????? ???????????????? ???????????? ???????? ????????
          </Text>
        </View>
      </View>
      <Text
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        ?????????? ???????????? :{" "}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="??????????????"
          style={styles.input}
          value={titre}
          onChangeText={(e) => setTitre(e)}
        />
      </View>
      <Text
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        ???????? ???????????? :{" "}
      </Text>
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
     
    </SafeAreaView>
  );
};

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
  formContainer: {
    width: windowWidth - 20,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
  },
  inputContainer: {
    backgroundColor: "#fff",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 15,
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
    textAlign: "center",
  },

  checkBoxsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    width: "100%",
    marginHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },

  checkBox: {
    height: 80,
    width: "45%",
    marginVertical: 5,
    marginHorizontal: "2.5%",
    flexDirection: "row",
  },
  checkBoxText: {
    fontSize: 15,
    color: COLORS.white,
    textAlign: "center",
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 100,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "green",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddResources;
