import { View, Text } from "react-native";
import React from "react";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react/cjs/react.production.min";
const TestImagePicker = () => {
  const widgetSettings = useMemo(
    () => ({
      getImageMetaData: false,
      initialLoad: 100,
      assetsType: [MediaType.photo, MediaType.video],
      minSelection: 1,
      maxSelection: 3,
      portraitCols: 4,
      landscapeCols: 4,
    }),
    []
  );
  return (
    <AssetsSelector
      Settings={widgetSettings}
      Errors={widgetErrors}
      Styles={widgetStyles}
      Resize={widgetResize} // optional
      Navigator={widgetNavigator} // optional
      CustomNavigator={{
        // optional
        Component: CustomNavigator,
        props: {
          backFunction: true,
          onSuccess,
          text: T.ACTIONS.SELECT,
        },
      }}
    />
  );
};

export default TestImagePicker;
