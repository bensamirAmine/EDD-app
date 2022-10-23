import {
  createDrawerNavigator,
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";
import * as Clipboard from "expo-clipboard";

import { COLORS } from "../config/colors";
import AntIcons from "@expo/vector-icons/AntDesign";

import Home from "../screens/Home";
import Animated from "react-native-reanimated";
import Header from "../components/Home/Header";
import SearchBar from "../components/Home/SearchBar";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, icon }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        height: 40,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "flex-end",
        borderRadius: 5,
        marginRight: 15,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          marginRight: 15,
          fontWeight: "bold",
          fontSize: 15,
          color: "white",
        }}
      >
        {label}
      </Text>
      <AntIcons name={icon} color={"white"} size={20} />
    </View>
  );
};

const CustomDrawerContent = ({ navigation }) => {
  const [userName, setUserName] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [role, setRole] = React.useState("");
  const [image, setimage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showCop, setShowCop] = React.useState(false);
  const isFocused = useIsFocused();

  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        const nom = await AsyncStorage.getItem("nom");
        const prenom = await AsyncStorage.getItem("prenom");
        const role = await AsyncStorage.getItem("role");
        const image = await AsyncStorage.getItem("image");
        if (role != "ROLE_ELEVE") {
          const code = await AsyncStorage.getItem("code");
          setCode(code);
        }

        setUserName(prenom + " " + nom);
        setUserId(id);
        setRole(role);
        setimage(image);
      }
    } catch (e) {
      console.log(e);
    }
  };
  function copied() {
    Clipboard.setString(code);
    setShowCop(true);
  }
  const removeData = async () => {
    try {
      // await AsyncStorage.removeItem("loggedUser");
      await AsyncStorage.clear();
    } catch (e) {
      // saving error
    }
  };
  function logout() {
    removeData();
    navigation.navigate("Login");
  }
  React.useEffect(() => {
    getData();
    setShowCop(false);
    navigation.closeDrawer();
  }, [isFocused]);
  return (
    <DrawerContentScrollView
      scrollEnabled={true}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}
      >
        {/*close */}
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.closeDrawer();
            }}
          >
            <AntIcons name="close" color={"white"} size={35} />
          </TouchableOpacity>
        </View>
        {/*Profile */}
        {userName != "" && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 15,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
            onPress={() => navigation.navigate("Profil",{
              profileId: userId,profileName: null,profileImage: null
            })}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginLeft: 15,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {userName}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  الذهاب إلى حسابي
                </Text>
              </View>
              <Image
                source={{
                  uri:
                    "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                    image,
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 40,
                  backgroundColor: "white",
                }}
              />
            </View>
          </TouchableOpacity>
        )}
        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            style={{
              marginBottom: 30,
            }}
          >
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
              <CustomDrawerItem label="الصَفحة الرَئيسيَة" icon="home" />
            </TouchableOpacity>
            {role == "ROLE_ADMIN" && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("inspecteurs")}
                >
                  <CustomDrawerItem label="قائمة المتفقدين" icon="team" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ens")}>
                  <CustomDrawerItem label="قائمة المعلمين" icon="team" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("eleves")}>
                  <CustomDrawerItem label="قائمة التلاميذ " icon="team" />
                </TouchableOpacity>
              </>
            )}
            {role == "ROLE_INSPECTEUR" && (
              <>
                <TouchableOpacity onPress={() => navigation.navigate("users")}>
                  <CustomDrawerItem label="قائمة المعلمين" icon="team" />
                </TouchableOpacity>
              </>
            )}
            {role == "ROLE_ENSEIGNANT" && (
              <>
                <TouchableOpacity onPress={() => navigation.navigate("users")}>
                  <CustomDrawerItem label="تلاميذي" icon="team" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MyMissions")}
                >
                  <CustomDrawerItem label="قائمة مهمَاتي" icon="checkcircleo" />
                </TouchableOpacity>
              </>
            )}
            {role != "ROLE_ELEVE" && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Projects")}
                >
                  <CustomDrawerItem label="قائمة المشاريع" icon="pushpino" />
                </TouchableOpacity>
              </>
            )}
            {role == "ROLE_ELEVE" && (
              <>
               <TouchableOpacity
                  onPress={() => navigation.navigate("Projects")}
                >
                  <CustomDrawerItem label="قائمة المشاريع" icon="pushpino" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MyMissions")}
                >
                  <CustomDrawerItem label="قائمة مهمَاتي" icon="checkcircleo" />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => navigation.navigate("Resources")}>
              <CustomDrawerItem label="المصادر" icon="paperclip" />
            </TouchableOpacity>

            <View
              style={{
                height: 1,
                marginLeft: 15,
                marginVertical: 15,
                backgroundColor: "#ddd",
              }}
            />
            {role != "ROLE_ELEVE" && (
              <TouchableOpacity
                onPress={() => {
                  copied();
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  المعرف الخاص بك:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {code}
                </Text>
                {showCop && (
                  <Text
                    style={{
                      fontSize: 15,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    تم النسخ
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              userName != "" ? logout() : navigation.navigate("Login")
            }
          >
            {userName != "" ? (
              <CustomDrawerItem label="تسجيل الخروج" icon="logout" />
            ) : (
              <CustomDrawerItem label="تسجيل الدخول" icon="login" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const CustomDrawer = () => {
  const [progress, setProgress] = React.useState(new Animated.Value(0));
  let screenwidth = Dimensions.get("window").width;
  let screenheight = Dimensions.get("window").height;
  const scale = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const borderRadius = Animated.interpolateNode(progress, {
    inputRange: [0, 0.5],
    outputRange: [0, 26],
  });
  const animatedStyle = { borderRadius, transform: [{ scale }] };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          Platform.OS === "android" ? COLORS.primary : COLORS.primary,
      }}
    >
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        screenOptions={{
          drawerStyle: {
            flex: 1,
            width: "65%",
            paddingRight: 20,
            backgroundColor: COLORS.primary,
          },
          sceneContainerStyle: {
            backgroundColor: "transparent",
          },
          overlayColor: "transparent",
          headerShown: false,
        }}
        initialRouteName="Home"
        drawerContent={(props) => {
          setTimeout(() => {
            setProgress(props.progress);
          }, 0);

          return <CustomDrawerContent navigation={props.navigation} />;
        }}
      >
        <Drawer.Screen name="Home1">
          {(props) => (
            <Home
              {...props}
              opened={false}
              drawerAnimationStyle={{
                height: screenheight - 100,
                width: screenwidth,
                marginTop: 80,
                marginLeft: Platform.OS === "android" ? 260 : 0,
              }}
              navigation={props.navigation}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};

export default CustomDrawer;
const styles = StyleSheet.create({});
