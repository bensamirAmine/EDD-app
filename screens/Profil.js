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
  Platform,
  ActivityIndicator,
} from "react-native";
import ImageView from "react-native-image-viewing";
import axios from "axios";
import { Video, AVPlaybackStatus } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Entypo } from "@expo/vector-icons";
import SectionTitle from "../components/SectionTitle";
import { adresseIp } from "../config/constants";
import { COLORS } from "../config/colors";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
const LIKE_URL = adresseIp + "/like/newLike";
const REMOVE_LIKE_URL = adresseIp + "/like/deleteLike";

const PUBLICATIONS_URL = adresseIp + "/publication/profilPublications";

const Profil = ({ navigation, route }) => {
  let width = Dimensions.get("window").width;

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [isLoadingSaleTops, setLoadingSaleTops] = React.useState(false);
  const [productsFromDB, setProductsFromDB] = React.useState([]);
  const [saleTopsFromDB, setSaleTopsFromDB] = React.useState([]);
  const [userName, setUserName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  // const [searched, setSearched] = React.useState([]);
  // const [typedText, setTypedText] = React.useState(searchText);
  const [category, setCategory] = React.useState(-1);
  /*image viewer */
  const [visible, setIsVisible] = React.useState(false);
  const [currentImageIndex, setImageIndex] = React.useState(0);
  const [imagesToShow, setImagesToShow] = React.useState([]);
  //
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [pubs, setPubs] = React.useState("");
  const [myImage, setMyImage] = React.useState("");
  const [pIm, setPIm] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [ecole, setEcole] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const { profileId, profileName, profileImage } = route.params;

  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const image = await AsyncStorage.getItem("image");
        const email = await AsyncStorage.getItem("email");
        const phone = await AsyncStorage.getItem("telephone");
        const ecole = await AsyncStorage.getItem("ecole");
        // const email = await AsyncStorage.getItem("email");
        setMyImage(image);
        setUserName(prenom + " " + nom);
        setUserId(id);
        setNom(nom);
        setPrenom(prenom);
        setEmail(email);
        setTelephone(phone.toString());
        setEcole(ecole);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  React.useEffect(() => {
    getData();
    fetchPublications();
    if (userId != profileId) {
      setPIm(profileImage);
    } else {
      setPIm(myImage);
    }
  }, [pubs]);

  // image viewer
  const onSelect = (index) => {
    setImageIndex(index);
    setIsVisible(true);
  };

  function prepareImages(src) {
    let json;
    var images = [];
    src.forEach((image) => {
      json = {
        uri:
          "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
          image.url,
      };
      images.push(json);
    });
    setImagesToShow(images);
  }
  //
  function fetchPublications() {
    axios
      .post(PUBLICATIONS_URL, {
        userId: profileId,
      })
      .then((response) => {
        setPubs(response.data);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }
  function liked(pub) {
    let res = true;
    pub.likes.forEach((like) => {
      if (like.users.id == userId) {
        res = false;
      }
    });
    return res;
  }
  function getLikeId(pub) {
    let res;
    pub.likes.forEach((like) => {
      if (like.users.id == userId) {
        res = like.id;
      }
    });
    return res;
  }
  function addLike(uId, pub) {
    axios
      .post(LIKE_URL, {
        userId: uId,
        publicationId: pub.id,
      })
      .then((response) => {
        fetchPublications();
      })
      .catch((error) => console.log(error));
  }
  function removeLike(pub) {
    let lId = getLikeId(pub);
    axios
      .post(REMOVE_LIKE_URL, {
        likeId: lId,
      })
      .then((response) => {
        fetchPublications();
      })
      .catch((error) => console.log(error));
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
          <Text style={styles.headerText}>الصفحة الشخصية</Text>
        </View>
        <View style={styles.headerRight}></View>
      </View>
      <View
        style={{
          flexDirection: "column",
          backgroundColor: COLORS.white,
          borderBottomEndRadius: 15,
          borderBottomStartRadius: 15,
          marginBottom: 2,
        }}
      >
        <Image
          style={{
            width: width,
            height: 100,
          }}
          source={require("../assets/cover.jpg")}
        />
        <Image
          style={{
            marginTop: 50,
            width: 100,
            height: 100,
            borderRadius: 100,
            position: "absolute",
            backgroundColor: "white",
            marginLeft: width / 2 - 50,
          }}
          source={{
            uri:
              "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
              pIm,
          }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row-reverse",
          }}
        >
          <TouchableOpacity
            style={{
              fontSize: 24,
              marginTop: 58,
              marginBottom: 12,
            }}
            onPress={() =>
              navigation.navigate("editUser", {
                userId: userId,
                unom: nom,
                uprenom: prenom,
                uemail: email,
                uphone: telephone,
                upassword: null,
                uecole: ecole,
              })
            }
          >
            {profileId == userId ? (
              <AntDesign name="edit" size={24} color={COLORS.primary} />
            ) : (
              <></>
            )}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              marginTop: 58,
              paddingRight: 8,
              marginBottom: 12,
            }}
          >
            {profileId == userId ? userName : profileName}
          </Text>
        </View>
      </View>
      <ScrollView style={{ paddingTop: 10 }}>
        <ImageView
          images={imagesToShow}
          imageIndex={currentImageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        {isLoading == false ? (
          <>
            {pubs.length == 0 && (
              <View
                style={{
                  width: width - 10,
                  height: width / 3,
                  backgroundColor: COLORS.white,
                  marginVertical: 10,
                  marginHorizontal: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.transparentBlack2,
                    fontSize: 18,
                    marginBottom: 20,
                  }}
                >
                  {" "}
                  لا يوجد أي منشور حتى الآن{" "}
                </Text>
                <Entypo
                  name="emoji-sad"
                  size={50}
                  color={COLORS.transparentBlack3}
                />
              </View>
            )}
            {pubs.reverse().map((pub, index) => (
              <View
                key={index}
                style={{
                  marginTop: 3,
                  marginBottom: 5,
                  backgroundColor: COLORS.white,
                  borderRadius: 15,
                }}
              >
                <View
                  style={{
                    flex: 0.2,
                    flexDirection: "row-reverse",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row-reverse",
                      height: 40,
                    }}
                  >
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        marginRight: 10,
                        marginTop: 10,
                        borderRadius: 100,
                      }}
                      source={{
                        uri:
                          "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                          pub.user.image,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        marginRight: 15,
                        marginTop: 15,
                        flex: 0.7,
                      }}
                    >
                      {pub.user.prenom + " " + pub.user.nom}
                      {"\u00A0"}
                      {"\u00A0"}
                      <Text
                        style={{
                          color: COLORS.orangeProject,
                          fontSize: 12,
                        }}
                      >
                        ( مدرسة : {pub.user.ecole})
                      </Text>
                    </Text>
                    {userId == pub.user.id && (
                      <>
                        <TouchableOpacity
                          style={{ flex: 0.3, marginTop: 12, paddingLeft: 12 }}
                        >
                          <Entypo
                            name="dots-three-horizontal"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    flexDirection: "column",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: COLORS.primary,
                      fontSize: 12,
                      marginRight: 50,
                      marginBottom: 5,
                    }}
                  >
                    المهمة : {pub.mission.titre}
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={{ paddingLeft: 15, paddingRight: 8 }}
                  >
                    {pub.description}
                  </Text>
                </View>

                {pub.image.length == 1 && (
                  <View>
                    {pub.image[0].type != "video" ? (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            prepareImages(pub.image);
                            onSelect(0);
                          }}
                        >
                          <Image
                            style={{
                              width: width,
                              height: width,
                              marginRight: 10,
                              marginTop: 10,
                            }}
                            source={{
                              uri:
                                "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                                pub.image[0].url,
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Video
                        ref={video}
                        style={{
                          width: width,
                          height: width,
                          marginRight: 10,
                          marginTop: 10,
                        }}
                        source={{
                          uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                        }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        onPlaybackStatusUpdate={(status) =>
                          setStatus(() => status)
                        }
                      />
                    )}
                  </View>
                )}

                {pub.image.length > 1 && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        prepareImages(pub.image);
                        onSelect(0);
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          style={{
                            width: width / 2,
                            height: width / 2,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: COLORS.white,
                          }}
                          source={{
                            uri:
                              "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                              pub.image[1].url,
                          }}
                        />
                        <Image
                          style={{
                            width: width / 2,
                            height: width / 2,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: COLORS.white,
                          }}
                          source={{
                            uri:
                              "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                              pub.image[0].url,
                          }}
                        />
                        <View
                          style={{
                            backgroundColor: COLORS.transparentBlack2,
                            position: "absolute",
                            width: width / 2,
                            height: width / 2,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: COLORS.white,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AntDesign
                            name="plussquareo"
                            size={30}
                            color="white"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                )}

                <View
                  style={{
                    flexDirection: "row-reverse",
                    marginTop: 10,
                    height: 40,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row-reverse",
                      width: width / 2,
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      if (liked(pub)) {
                        addLike(userId, pub);
                      } else {
                        removeLike(pub);
                      }
                    }}
                  >
                    <AntDesign
                      name="like1"
                      size={20}
                      color={
                        liked(pub) ? COLORS.transparentBlack3 : COLORS.primary
                      }
                      style={{
                        marginTop: 2,
                        marginBottom: 18,
                        marginRight: 10,
                        // borderBottomColor: COLORS.primary,
                        // borderBottomWidth: 1.5,
                        paddingBottom: -5,
                        lineHeight: 19,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: liked(pub) ? "black" : COLORS.primary,
                        marginTop: 2,
                        marginBottom: 18,
                        paddingRight: 5,
                        // borderBottomColor: COLORS.primary,
                        // borderBottomWidth: 1.5,
                        paddingBottom: -5,
                        lineHeight: 20,
                      }}
                    >
                      {pub.likes.length} أعجبني
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row-reverse",
                      width: width / 2,
                      alignContent: "center",
                      justifyContent: "center",
                      borderBottomColor: "black",
                    }}
                    onPress={() => {
                      navigation.navigate("Comments", {
                        comments: pub.commentaires,
                        likes: pub.likes.length,
                        pubId: pub.id,
                        userId: userId,
                        myImage: myImage,
                        userName: userName,
                      });
                    }}
                  >
                    <FontAwesome
                      name="comments"
                      size={20}
                      color={COLORS.transparentBlack3}
                      style={{
                        marginTop: 2,
                        marginBottom: 18,
                        marginRight: 10,
                        // borderBottomColor: COLORS.primary,
                        // borderBottomWidth: 1.5,
                        paddingBottom: -5,
                        lineHeight: 19,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "black",
                        marginTop: 2,
                        marginBottom: 18,
                        paddingRight: 5,
                        // borderBottomColor: COLORS.primary,
                        // borderBottomWidth: 1.5,
                        paddingBottom: -5,
                        lineHeight: 20,
                      }}
                    >
                      {pub.commentaires.length} تعليقات
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <ActivityIndicator size="large" color="#00ff00" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profil;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ccc",
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
