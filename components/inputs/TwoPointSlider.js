import React from "react";

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { COLORS } from "../../config/colors";
import { View, StyleSheet, Dimensions, Text } from "react-native";

function TwoPointSlider({ values, min, max, preFix, postFix, onValueChange }) {
  let screenwidth = Dimensions.get("window").width;
  let screenheight = Dimensions.get("window").height;
  return (
    <MultiSlider
      values={values}
      sliderLength={screenwidth - 68}
      min={min}
      max={max}
      step={1}
      markerOffsetY={20}
      selectedStyle={{
        backgroundColor: COLORS.primary,
      }}
      trackStyle={{
        height: 10,
        borderRadius: 10,
        backgroundColor: COLORS.secondary,
      }}
      minMarkerOverlapDistance={50}
      customMarker={(e) => {
        return (
          <View
            style={{
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                borderWidth: 4,
                borderColor: COLORS.white,
                backgroundColor: COLORS.primary,
                ...styles.shadow,
              }}
            ></View>
            <Text
              style={{
                marginTop: 6,
                color: COLORS.primary,
                fontWeight: "bold",
                fontSize: 18,
                textAlign: "center",
                width: 100,
              }}
            >
              {preFix}
              {e.currentValue}
              {postFix}
            </Text>
          </View>
        );
      }}
      onValuesChange={(values) => onValueChange(values)}
    />
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
  },
});
export default TwoPointSlider;
