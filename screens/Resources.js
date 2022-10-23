import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StatusBar,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import ImageView from "react-native-image-viewing";
import React from "react";
import axios from "axios";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const MISSIONS_URL = adresseIp + "/ressources/";
const DELETE_RES_URL = adresseIp + "/ressources/deleteRessource";
const DELETE_Link_URL = adresseIp + "/links/deleteLink";
const LINKS_URL = adresseIp + "/links/";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Resources = ({ navigation }) => {
  const [resp, setResp] = React.useState("");
  const [links, setLinks] = React.useState("");
  const [role, setRole] = React.useState("");
  const [visible, setIsVisible] = React.useState(false);
  const [loading, setIsloading] = React.useState(true);
  const [loading2, setIsloading2] = React.useState(true);
  const [currentImageIndex, setImageIndex] = React.useState(0);

  const [imagesToShow, setImagesToShow] = React.useState([]);

  const createTwoButtonAlert = (id) =>
    Alert.alert("", "هل ترغب بحذف هذا المصدر ؟", [
      {
        text: "إلغاء",
        onPress: () => console.log("إلغاء"),
        style: "cancel",
      },
      { text: "حذف المصدر", onPress: () => deleteRes(id) },
    ]);

  const createTwoButtonAlert1 = (id) =>
    Alert.alert("", "هل ترغب بحذف هذا المصدر ؟", [
      {
        text: "إلغاء",
        onPress: () => console.log("إلغاء"),
        style: "cancel",
      },
      { text: "حذف المصدر", onPress: () => deleteLink(id) },
    ]);
  function prepareImages(src) {
    let json;
    var images = [];
    src.forEach((image) => {
      json = {
        uri:
          "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
          image.image,
      };
      images.push(json);
    });
    setImagesToShow(images);
  }

  const onSelect = (index) => {
    setImageIndex(index);
    setIsVisible(true);
  };
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const role = await AsyncStorage.getItem("role");
        const parrain = await AsyncStorage.getItem("parrain");

        setRole(role);
      }
    } catch (e) {
      // console.log(e);
    }
  };
  getData();
  React.useEffect(() => {
    fetRes();
    fetlinks();
    getData();
  }, [resp, links]);
  function fetRes() {
    axios
      .post(MISSIONS_URL)
      .then((response) => {
        setResp(response.data);
      })
      .finally(() => {
        setIsloading(false);
        prepareImages(resp);
      });
  }
  function fetlinks() {
    axios
      .post(LINKS_URL)
      .then((response) => {
        setLinks(response.data);
      })
      .finally(() => {
        setIsloading2(false);
        prepareImages(resp);
      });
  }
  function deleteRes(id) {
    console.log("delete function");
    axios
      .post(DELETE_RES_URL, {
        ressourceId: id,
      })
      .finally(() => {
        fetRes();
        console.log("delete finally");
      });
  }
  function deleteLink(id) {
    console.log("delete function");
    axios
      .post(DELETE_Link_URL, {
        linkId: id,
      })
      .finally(() => {
        fetRes();
        console.log("delete finally");
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
          <Text style={styles.headerText}> قائمة المصادر</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>

      <ScrollView>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>المصادر الأساسية</Text>
        </View>
        <ImageView
          images={imagesToShow}
          imageIndex={currentImageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <View style={styles.galleryContainer}>
        {role != "ROLE_ELEVE" && (
          <TouchableOpacity>
            <View style={styles.galleryItem}>
              <TouchableOpacity
                style={{
                  width: "100%",
                }}
                onPress={() => {
                  navigation.navigate("AddResources");
                }}
              >
                <View style={styles.galleryItemIconAddContainer}>
                  <Icon
                    name="add"
                    size={30}
                    style={styles.addIcon}
                    color={COLORS.white}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
          {!loading ? (
            <>
              {resp.map((res, index) => (
                <>
                  <TouchableOpacity key={index} onPress={() => onSelect(index)}>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        zIndex: 3,
                        left: 5,
                        top: -5,
                        backgroundColor: "red",
                        height: 20,
                        width: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        borderRadius: 20,
                      }}
                      onPress={() => {
                        createTwoButtonAlert(res.id);
                        console.log("delete clicked");
                      }}
                    >
                      <Entypo name="cross" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                    <View style={styles.galleryItem}>
                      <View style={styles.galleryItemImageContainer}>
                        <Image
                          source={{
                            uri:
                              "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                              res.image,
                          }}
                          style={styles.galleryItemImage}
                        />
                      </View>
                      <View style={styles.galleryItemText}>
                        <Text style={styles.galleryItemTextTitle}>
                          {res.titre}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </>
              ))}
            </>
          ) : (
            <View style={styles.galleryItem}>
              <View style={styles.galleryItemImageContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
            </View>
          )}
        </View>
        <View
          style={[
            styles.sectionTitleContainer,
            {
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.sectionTitle}> روابط مهمة</Text>
          {role != "ROLE_ELEVE" && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddLink");
            }}
          >
            <Entypo name="plus" size={30} color={COLORS.black} />
          </TouchableOpacity>
          )}

        </View>
        <View style={styles.usefullLinksContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {!loading2 ? (
              <>
                {links.map((res, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => Linking.openURL(res.link)}
                  >
                    <View style={styles.usefullLinksCard}>
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          zIndex: 3,
                          right: 25,
                          top: 38,
                          backgroundColor: "red",
                          height: 20,
                          width: 20,
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          borderRadius: 20,
                        }}
                        onPress={() => {
                          createTwoButtonAlert1(res.id);
                          console.log("delete clicked");
                        }}
                      >
                        <Entypo name="cross" size={20} color={COLORS.white} />
                      </TouchableOpacity>
                      <View style={styles.usefullLinksCardIcon}>
                        <Entypo name="link" size={30} color={COLORS.black} />
                      </View>
                      <View style={styles.usefullLinksCardText}>
                        <Text style={styles.usefullLinksCardTextTitle}>
                          {res.titre}
                        </Text>
                        <Text style={styles.usefullLinksCardTextLink}>
                          {res.link}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <ActivityIndicator size="large" color="#00ff00" />
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Resources;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
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
  sectionTitleContainer: {
    height: 40,
    width: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: COLORS.black,
  },
  firstSection: {
    height: 150,
    width: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
  },
  firstSectionCard: {
    height: 100,
    width: windowWidth / 3,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
  },
  firstSectionCardImage: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
  usefullLinksContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 50,
  },
  usefullLinksCard: {
    height: 100,
    width: "100%",
    backgroundColor: "#72D3F7",
    justifyContent: "center",
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
  usefullLinksCardIcon: {
    height: "100%",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  usefullLinksCardText: {
    height: "100%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  usefullLinksCardTextTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
  },
  usefullLinksCardTextLink: {
    fontSize: 15,
    color: COLORS.black,
  },
  galleryContainer: {
    paddingVertical: 20,
    width: "100%",
    marginBottom: 10,
    backgroundColor: COLORS.white,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
  },
  galleryItem: {
    height: 110,
    width: windowWidth / 3,
    backgroundColor: COLORS.white,
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 50,
  },
  galleryItemImageContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  galleryItemImage: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
  galleryItemText: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryItemTextTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: 10,
    textAlign: "center",
  },
  galleryItemIconAddContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.transparentBlack3,
    borderRadius: 20,
  },
  galleryItemIconAdd: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
});
