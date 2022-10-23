import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../config/colors";
import { useNavigation } from "@react-navigation/native";
function SectionTitle(props) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        paddingHorizontal: 10,
        paddingVertical: 15,
        paddingLeft: 20,
        backgroundColor: COLORS.white,
        marginTop: 10,
        borderRadius: 15,
        marginHorizontal: 10,
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Products", {
            find: props.title,
          });
        }}
      >
        <Text>Liste de {props.title} </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontWeight: "bold",
          color: COLORS.primary,
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

export default SectionTitle;
