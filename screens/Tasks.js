import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { COLORS } from "../config/colors";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function Tasks({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>قائمة المهام</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
            <Entypo name="plus" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate("Missiondesc")}>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.cardIcons}>
              <Entypo name="plus" size={40} color="white" />
            </TouchableOpacity>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>أول مهمة</Text>
              <Text style={styles.cardDescription} numberOfLines={1}>
                مساهيس هايت تسايع حخشسع نسن أول مهمة مساهيس هايت تسايع حخشسع نسن
                أول مهمة مساهيس هايت تسايع حخشسع نسن أول مهمة
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Missiondesc")}>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.cardIcons}>
              <Entypo name="plus" size={40} color="white" />
            </TouchableOpacity>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>أول مهمة</Text>
              <Text style={styles.cardDescription} numberOfLines={1}>
                مساهيس هايت تسايع حخشسع نسن أول مهمة مساهيس هايت تسايع حخشسع نسن
                أول مهمة مساهيس هايت تسايع حخشسع نسن أول مهمة
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFE",
    height: "100%",
    width: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
});
