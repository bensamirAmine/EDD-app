import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import { COLORS } from "../../config/colors";

const TextButton = ({
  label,
  imageUrl,
  labelStyle,
  buttonContainerStyle,
  onPress,
  withImage,
}) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        ...buttonContainerStyle,
      }}
      onPress={onPress}
    >
      {withImage && (
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={{
            width: 30,
            height: 30,
            resizeMode: "contain",

            marginRight: 7,
          }}
        />
      )}

      <Text
        style={{
          color: COLORS.white,
          fontWeight: "bold",
          fontSize: 15,
          ...labelStyle,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
