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
import React from "react";
import axios from "axios";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ADD_PROJECT_URL = adresseIp + "/projet/newProjet";
var goalsin = [
  { id: 1, txt: "الهدف 1 : القضاء على الفقر", isChecked: false },
  {
    id: 2,
    txt: "الهدف 2 : القضاء التام على الجوع",
    isChecked: false,
  },
  {
    id: 3,
    txt: "الهدف 3 : الصحة الجيدة و الرفاه",
    isChecked: false,
  },
  { id: 4, txt: "الهدف 4 : التعليم الجيد", isChecked: false },
  { id: 5, txt: "الهدف 5 : المساواة بين الجنسين", isChecked: false },
  {
    id: 6,
    txt: "الهدف 6 : المياه النظيفة والنظافة الصحية",
    isChecked: false,
  },
  {
    id: 7,
    txt: "الهدف 7 : طاقة نظيفة و بأسعار معقولة",
    isChecked: false,
  },
  { id: 8, txt: "الهدف 8 : العمل اللائق و نمو الاقتصاد", isChecked: false },
  {
    id: 9,
    txt: "الهدف 9 : الصناعة و الابتكار والهياكل الأساسية",
    isChecked: false,
  },
  {
    id: 10,
    txt: "الهدف 10 : الحد من أوجه عدم المساواة",
    isChecked: false,
  },
  { id: 11, txt: "الهدف 11 : مدن ومجتمعات محلية مستدامة", isChecked: false },
  { id: 12, txt: "الهدف 12 : الاستهلاك والإنتاج المسؤولان للموارد", isChecked: false },
  { id: 13, txt: "الهدف 13 : العمل المناخي", isChecked: false },
  { id: 14, txt: "الهدف 14 : الحياة تحت الماء", isChecked: false },
  { id: 15, txt: "الهدف 15 : الحياة في البر", isChecked: false },
  { id: 16, txt: "الهدف 16 : السلام و العدل و المؤسسات القوية", isChecked: false },
  { id: 17, txt: "الهدف 17 : عقد الشراكات لتحقيق الأهداف", isChecked: false },
];

const AddProject = ({ navigation }) => {
  const [selectedCat, setSelectedCat] = React.useState(-1);
  const [titre, setTitre] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [domaine, setDomaine] = React.useState("");
  const [nbMission, setNbMission] = React.useState(0);
  const [goals1, setGoals1] = React.useState(goalsin);
  const [response, setResponse] = React.useState("");
  const [mustChange, setMustChange] = React.useState(false);
  const [goalsToAdd, setgoalsToAdd] = React.useState([]);
  const [isError, setIsError] = React.useState(false);
  const [hideLoading, setHideLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);

  function makeItChecked(id) {
    let goals = goals1;
    let gta = [];
    for (var i = 0; i < goals.length; i++) {
      if (goals[i].id == id) {
        goals[i].isChecked = !goals[i].isChecked;
        break;
      }
    }

    for (var i = 0; i < goals1.length; i++) {
      if (goals[i].isChecked == true) {
        gta.push(goals[i]);
      }
    }

    setGoals1(goals);
    setgoalsToAdd(gta);
    setMustChange(!mustChange);
  }

  function addproject() {
    
    setHideLoading(false);
    axios
      .post(ADD_PROJECT_URL, {
        titre: titre,
        description: description,
        domaine: domaine,
        nb_mission: nbMission,
        goals: goalsToAdd,
      })
      .then((response) => {
        setResponse(response.data);
      })
      .finally(() => {
        setIsLoading(false);
        navigation.navigate("Projects");
      }).catch(function (error) {
        setIsError(true);
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }
  React.useEffect(() => {
    // console.log("in useeffect");
    // console.log("goalstoadd ===>", goalsToAdd);
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
          <TouchableOpacity onPress={() => navigation.navigate("Projects")}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>اضافة مشروع</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.titleCardContainer}>
          <View style={styles.titleCardText}>
            <Text style={styles.titleCardTitle}>أضف مشروعا جديدا</Text>
            <Text style={styles.titleCardDescription}>
              قم بادخال المعلومات المطلوبة لاضافة مشروع جديد
            </Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            أدخل معلومات المشروع :
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="عنوان المشروع"
              style={styles.input}
              value={titre}
              onChangeText={(e) => setTitre(e)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="ميدان المشروع"
              style={styles.input}
              value={domaine}
              onChangeText={(e) => setDomaine(e)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="عدد المهمَات"
              style={styles.input}
              value={nbMission}
              onChangeText={(e) => setNbMission(e)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              multiline={true}
              numberOfLines={20}
              placeholder="محتوى المشروع"
              style={styles.input}
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
              color: COLORS.black,
            }}
          >
            اختر هدفا على الأقل :
          </Text>
          <View style={styles.checkBoxsContainer}>
            {goals1.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkBox}
                onPress={() => {
                  makeItChecked(item.id);
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    backgroundColor: item.isChecked
                      ? COLORS.primary
                      : COLORS.transparentBlack2,
                  }}
                >
                  <Text style={styles.checkBoxText}>{item.txt}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              addproject();
            }}
          >
            <Text style={styles.buttonText}>اضافة</Text>
            {!hideLoading && (
                <ActivityIndicator size="small" color="#00ff00" />
              )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProject;
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
