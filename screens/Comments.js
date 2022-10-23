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
import { adresseIp } from "../config/constants";
import axios from "axios";

import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ADD_COMMENT_URL = adresseIp + "/commentaire/newCommentaire";

const Comments = ({ navigation, route }) => {
  const [comment, setComment] = React.useState("");
  const [newComments, setNewComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState("");
  const { comments, likes, pubId, userId, myImage, userName } = route.params;

  let newComments1 = [];

  function addComment() {
    var cmnt = {
      description: comment,
      myImage: myImage,
      userName: userName,
    };
    newComments1.push(cmnt);
    setNewComments(newComments1);
    axios
      .post(ADD_COMMENT_URL, {
        publicationId: pubId,
        userId: userId,
        description: comment,
      })
      .then((response) => {
        setComment("");
      })
      .finally(() => {
        setIsLoading(false);
        setRunuseeffect(!runuseeffect);
      })
      .catch((error) => console.log(error.response));
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>التَعليقات</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.likesCount}>
            <Text style={styles.likesCountText}>{likes}</Text>
            <Entypo name="thumbs-up" size={20} color={COLORS.black} />
          </View>
        </View>
      </View>
      <ScrollView style={styles.commentsContainer}>
        {comments.map((comm, index) => (
          <View key={index} style={styles.comment}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentHeaderText}>
                {comm.user.prenom + " " + comm.user.nom}
              </Text>
              <Image
                source={{
                  uri:
                    "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                    comm.user.image,
                }}
                style={styles.commentAvatar}
              />
            </View>
            <View style={styles.commentBody}>
              <Text style={styles.commentBodyText}>{comm.description}</Text>
            </View>
          </View>
        ))}

        {newComments.map((ncomm, index) => (
          <View key={index} style={styles.comment}>
           
            <View style={styles.commentHeader}>
            
              <Text style={styles.commentHeaderText}>{ncomm.userName}</Text>
              
              <Image
                source={{
                  uri:
                    "https://www.edd-network.tn/developpement_durable_symfony/public/uploads/" +
                    ncomm.myImage,
                }}
                style={styles.commentAvatar}
              />
            </View>
            <View style={styles.commentBody}>
              <Text style={styles.commentBodyText}>{ncomm.description}</Text>
            </View>
          </View>
        ))}
        {/* <View style={styles.comment}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderText}>محمد أمين بن سمير</Text>
            <Image
              source={require("../assets/2.png")}
              style={styles.commentAvatar}
            />
          </View>
          <View style={styles.commentBody}>
            <Text style={styles.commentBodyText}>أحسنت</Text>
          </View>
        </View>
        <View style={styles.comment}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderText}>محمد أمين بن سمير</Text>
            <Image
              source={require("../assets/2.png")}
              style={styles.commentAvatar}
            />
          </View>
          <View style={styles.commentBody}>
            <Text style={styles.commentBodyText}>أحسنت</Text>
          </View>
        </View> */}
      </ScrollView>
      <View style={styles.addCommentContainer}>
        <View style={styles.addComment}>
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={() => {
              addComment();
            }}
          >
            <Icon
              name="send"
              size={30}
              style={{ transform: [{ rotateY: "180deg" }] }}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.addCommentTextInput}
            placeholder="أضف تعليقك"
            placeholderTextColor={COLORS.gray}
            onChangeText={(text) => setComment(text)}
            value={comment}
          />
        </View>
      </View>
      
    </SafeAreaView>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFE",
    height: "100%",
    width: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 15,
  },
  header: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: COLORS.transparentBlack1,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
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
  likesCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginRight: 5,
  },
  commentsContainer: {
    height: windowHeight - 60,
    width: "100%",
    backgroundColor: COLORS.orangeLightProject,
  },
  comment: {
    height: "auto",
    width: "95%",
    backgroundColor: COLORS.primary,
    borderColor: COLORS.transparentBlack1,
    borderWidth: 1,
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 10,
    marginTop: 10,
    marginLeft: "2.5%",
    padding: 10,
    paddingRight: 20,
  },
  commentHeader: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  commentHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  commentAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 10,
    backgroundColor: COLORS.white,
  },
  commentBody: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 25,
    paddingVertical: 10,
  },
  commentBodyText: {
    fontSize: 15,
    color: COLORS.white,
  },
  addCommentContainer: {
    height: "auto",
    width: "100%",
    backgroundColor: COLORS.orangeLightProject,
    padding: 10,
  },
  addComment: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  addCommentTextInput: {
    height: 50,
    width: "80%",
    borderColor: COLORS.transparentBlack1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 15,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  addCommentButton: {
    height: 50,
    width: 50,
    borderRadius: 20,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  delete: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: COLORS.orangeProject,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
