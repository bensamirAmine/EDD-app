import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import React from "react";
import axios from "axios";
import { adresseIp } from "../config/constants";
import { ImageBrowser } from "expo-image-picker-multiple";

import { COLORS } from "../config/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { onChange } from "react-native-reanimated";
const ADD_MISS_URL = adresseIp + "/mission/newMission";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddMission = ({ navigation, route }) => {
  const { projetId } = route.params;
  const [project, setProject] = React.useState("Unknown");
  const [date, setDate] = React.useState(new Date());
  const [date1, setDate1] = React.useState(new Date());
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const [show1, setShow1] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [role, setRole] = React.useState("");
  const [parrain, setParrain] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [missions, setMissions] = React.useState([]);
  const [selectedMission, setSelectedMission] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [titre, setTitre] = React.useState("");
  const [formdatastate, setFormdatastate] = React.useState(new FormData());
  const [isError, setIsError] = React.useState(false);
  const [hideLoading, setHideLoading] = React.useState(true);
  const [description, setDescription] = React.useState("");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };
  const onChange1 = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow1(false);
    setDate1(currentDate);
  };

  function addMiss() {
    setHideLoading(false);
    let formdata = new FormData();
    formdata.append("titre", titre);
    formdata.append("description", description);
    formdata.append("start", date.toString());
    formdata.append("end", date1.toString());
    formdata.append("projetId", projetId);
    formdata.append("image", {
      uri: image[0].uri,
      name: image[0].filename,
      type: "image/png", // This is important for Android!!
    });

    console.log("img : " + image[0]);

    axios({
      url: ADD_MISS_URL,
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

        navigation.navigate("Projects");
      })
      .catch(function (error) {
        setHideLoading(true);
        setIsError(true);
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
    // .catch((error) => console.log(error.response));
  }
  React.useEffect(() => {
    if (!isLoading) {
      if (!isError) {
        console.log("iserror ->", isError);
        navigation.navigate("Projects");
      } else {
        console.log("->", isError);
      }
    }
  }, [isError]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>اضافة مهمَة</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              addMiss();
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
      <ScrollView style={styles.body} nestedScrollEnabled={true}>
        <View style={styles.titleCardContainer}>
          <View style={styles.titleCardText}>
            <Text style={styles.titleCardTitle}>أضف مهمَة جديدة</Text>
            <Text style={styles.titleCardDescription}>
              قم بادخال المعلومات المطلوبة لاضافة مهمَة جديدة
            </Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
          {show1 && (
            <DateTimePicker
              testID="dateTimePicker1"
              value={date1}
              mode={mode}
              is24Hour={true}
              onChange={onChange1}
            />
          )}

          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            أدخل معلومات المهمَة :
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="عنوان المهمَة"
              style={styles.input}
              value={titre}
              onChangeText={(e) => setTitre(e)}
            />
          </View>
          {/* <View style={styles.inputContainer}>
            <Picker
              selectedValue={project}
              onValueChange={(value, index) => setProject(value)}
              mode="dropdown" // Android only
              style={styles.picker}
            >
              <Picker.Item label="اختر مشروعا" value="Unknown" />
              <Picker.Item label="المشروع الأوَل" value="1" />
            </Picker>
          </View> */}
          <View style={styles.inputContainer}>
            <TextInput
              multiline={true}
              numberOfLines={20}
              placeholder="محتوى المهمَة"
              style={styles.input}
              value={description}
              onChangeText={(e) => setDescription(e)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="من :"
              style={styles.input}
              value={date.toLocaleDateString()}
            />
            <TouchableOpacity
              onPress={() => {
                setShow(true);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 19,
                  paddingHorizontal: 5,
                }}
              >
                من :
              </Text>
              <Icon name="date-range" size={21} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="إلى :"
              style={styles.input}
              value={date1.toLocaleDateString()}
            />
            <TouchableOpacity
              onPress={() => {
                setShow1(true);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 19,
                  paddingHorizontal: 5,
                }}
              >
                إلى :
              </Text>
              <Icon name="date-range" size={21} />
            </TouchableOpacity>
          </View>
        </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMission;
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
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: "45%",
    marginVertical: 5,
    marginHorizontal: "2.5%",
    flexDirection: "row",
    backgroundColor: COLORS.transparentBlack2,
    borderRadius: 10,
    padding: 10,
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
  picker: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
