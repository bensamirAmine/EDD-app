import "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import Login from "./screens/Login";
import Inscrption from "./screens/Inscrption";
import Tasks from "./screens/Tasks";
import Constants from "expo-constants";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import CustomDrawer from "./navigation/CustomDrawer";
import Profil from "./screens/Profil";
import AddPublications from "./screens/AddPublications";
import AddMission from "./screens/AddMission";
import AddProject from "./screens/AddProject";
import AddResources from "./screens/AddResources";
import Comments from "./screens/Comments";
import Resources from "./screens/Resources";
import Projects from "./screens/Projects";
import MyMissions from "./screens/MyMissions";
import MissionDescription from "./screens/MissionDescription";
import ProjectDescription from "./screens/ProjectDescription";
import UsersByParList from "./screens/UsersByParList";
import Ens from "./screens/Ens";
import Eleve from "./screens/Eleve";
import Inspecteurs from "./screens/Inspecteurs";
import AddLink from "./screens/AddLink";
import * as Network from 'expo-network';
import EditUser from "./screens/EditUser";
const Stack = createNativeStackNavigator();
const ipAlert = async () => {
  const ip = await Network.getIpAddressAsync()
  if(ip =="0.0.0.0"){
    alert("الرجاء التثبت من الاتصال بالانترنات...")
  }
};

ipAlert();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} component={CustomDrawer} />
        <Stack.Screen name="AddTask" component={AddMission} />
        <Stack.Screen name="Inscription" component={Inscrption} />
        <Stack.Screen name="users" component={UsersByParList} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="AddProject" component={AddProject} />
        <Stack.Screen name="AddLink" component={AddLink} />
        <Stack.Screen name="AddResources" component={AddResources} />
        <Stack.Screen name="AddPublications" component={AddPublications} />
        <Stack.Screen name="Profil" component={Profil} />
        <Stack.Screen name="Resources" component={Resources} />
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name="Projects" component={Projects} />
        <Stack.Screen name="Missiondesc" component={MissionDescription} />
        <Stack.Screen name="Projectdesc" component={ProjectDescription} />
        <Stack.Screen name="MyMissions" component={MyMissions} />
        <Stack.Screen name="inspecteurs" component={Inspecteurs} />
        <Stack.Screen name="ens" component={Ens} />
        <Stack.Screen name="eleves" component={Eleve} />
        <Stack.Screen name="editUser" component={EditUser} />

        {/* <Stack.Screen
          name="Details"
          component={Details}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
});
