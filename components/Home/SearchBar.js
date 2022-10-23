import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "../../config/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function SearchBar({ showModal, childToParent }) {
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const data = "This is data from Child Component to the Parent Component.";
  return (
    <View
      style={{
        marginTop: 15,
        flexDirection: "row",
      }}
    >
      <View style={styles.searchContainer}>
        <IonIcons
          style={{
            marginLeft: 20,
          }}
          name="search"
          size={23}
        />

        <TextInput
          placeholder="recherche"
          style={styles.textInput}
          onChangeText={(newText) => childToParent(newText)}
        />
      </View>
      <TouchableOpacity onPress={() => showModal()}>
        <View style={styles.sortBtn}>
          <MaterialIcons name="sort" size={30} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 20,
  },
  sortBtn: {
    marginLeft: 10,
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
export default SearchBar;
