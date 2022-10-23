import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import Autolink from "react-native-autolink";
import ImageView from "react-native-image-viewing";
import axios from "axios";
import { Video, AVPlaybackStatus } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SectionTitle from "../components/SectionTitle";
import { adresseIp } from "../config/constants";
import { COLORS } from "../config/colors";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const PUBLICATIONS_URL = adresseIp + "/publication/allPublications";
const DELETE_PUBLICATIONS_URL = adresseIp + "/publication/deletePublication";
const LIKE_URL = adresseIp + "/like/newLike";
const REMOVE_LIKE_URL = adresseIp + "/like/deleteLike";

const Index = ({ searchText }) => {
  const navigation = useNavigation();
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [isLoadingSaleTops, setLoadingSaleTops] = React.useState(false);
  const [productsFromDB, setProductsFromDB] = React.useState([]);
  const [saleTopsFromDB, setSaleTopsFromDB] = React.useState([]);
  const [userName, setUserName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [userRole, setUserRole] = React.useState("");
  const [searched, setSearched] = React.useState([]);
  const [typedText, setTypedText] = React.useState(searchText);
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

  let width = Dimensions.get("window").width;

  const childToParent = (childdata) => {
    setCategory(childdata);
  };
  const createTwoButtonAlert = (id) =>
    Alert.alert("", "هل ترغب بحذف هذا المنشور ؟", [
      {
        text: "إلغاء",
        onPress: () => console.log("إلغاء"),
        style: "cancel",
      },
      { text: "حذف المنشور", onPress: () => deletePublications(id) },
    ]);
  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const image = await AsyncStorage.getItem("image");
        const role = await AsyncStorage.getItem("role");
        setMyImage(image);
        setUserName(prenom + " " + nom);
        setUserId(id);
        setUserRole(role);
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getData();
    fetchPublications();
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
      .post(PUBLICATIONS_URL)
      .then((response) => {
        setPubs(response.data);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }
  function deletePublications(id) {
    axios
      .post(DELETE_PUBLICATIONS_URL, {
        publicationId: id,
      })
      .then((response) => {})
      .finally(() => {
        setLoading(false);
        fetchPublications();
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
    <View>
      <View
        style={{
          backgroundColor: "white",
          height: 80,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row-reverse",
            backgroundColor: COLORS.white,
            height: 50,
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            overflow: "hidden",
            marginVertical: 8,
            marginHorizontal: 8,
          }}
        >
          <View
            style={{
              width: (2 * width) / 3,
              height: "100%",
              backgroundColor: COLORS.blueLightProject,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              onPress={() => navigation.navigate("AddPublications")}
              style={{
                color: "#000",
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              هل قمت بإنجاز مهمة جديدة ؟
            </Text>
          </View>
          <View
            style={{
              width: width / 3,
              height: "100%",
              backgroundColor: COLORS.orangeProject,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
              }}
              onPress={() => navigation.navigate("AddPublications")}
            >
              إضافة +
            </Text>
          </View>
          {/* <TextInput
          placeholder="هل قمت بإنجاز مهمة جديدة ؟"
          placeholderTextColor={"black"}
          style={{
            flex: 0.8,
            height: 40,
            marginTop: 20,
            marginBottom: 20,
            textAlign: "center",
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: 40,
            fontSize: 18,
            color: "black",
          }}
          
        />
        <Entypo
          name="images"
          size={40}
          color={COLORS.primary}
          style={{
            flex: 0.2,
            paddingLeft: 5,
            marginTop: 20,
            marginBottom: 20,
          }}
          
        /> */}
        </View>
      </View>

      {/* <View>
        <TouchableOpacity
          
        >
          <Text>Add post</Text>
        </TouchableOpacity>
      </View> */}
      <ScrollView>
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
                      onPress={() =>
                        navigation.navigate("Profil", {
                          profileId: pub.user.id,
                          profileName: pub.user.prenom + " " + pub.user.nom,
                          profileImage: pub.user.image,
                        })
                      }
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        marginRight: 15,
                        marginTop: 15,
                        flex: 0.7,
                      }}
                      onPress={() =>
                        navigation.navigate("Profil", {
                          profileId: pub.user.id,
                          profileName: pub.user.prenom + " " + pub.user.nom,
                          profileImage: pub.user.image,
                        })
                      }
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
                    {(userId == pub.user.id || userRole != "ROLE_ELEVE") && (
                      <>
                        <TouchableOpacity
                          style={{ flex: 0.3, marginTop: 12, paddingLeft: 12 }}
                          onPress={() => {
                            createTwoButtonAlert(pub);
                          }}
                        >
                          <Entypo name="cross" size={24} color="black" />
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
                    
                    <Autolink
                      // Required: the text to parse for links
                      text={pub.description}
                    />
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
    </View>
  );
};

export default Index;
