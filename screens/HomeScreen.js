import React, {
  Component,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  ScrollView,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Avatar, ListItem, LinearProgress } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import localStorage from "../helpers/LocalStorageHelper";
import moment from "moment";

const HomeScreen = ({ navigation }) => {
  const [channels, setChannels] = useState([]);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102014/tv_logo.png",
            }}
          />
          <Text
            style={{
              color: "white",
              marginLeft: 10,
              fontWeight: "700",
            }}
          >
            IPTV PLAYER
          </Text>
        </View>
      ),

      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <FontAwesome name="gear" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      localStorage.getLocalStorageData("KEY").then((key) => {
        if (!key) {
          navigation.navigate("Settings");
        } else {
          if (!channels.length) getAllChannels();
        }
      });
      // refresh epg every 5 minutes
      //const dataInterval = setInterval(() => getAllChannels(), 300 * 1000);
      //return () => clearInterval(dataInterval);
      //
    }
  }, [isFocused]);

  const getAllChannels = () => {
    fetch("http://188.166.0.142/ionic/postResponse.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newName: "",
        id: 230780,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setChannels(json);
        console.log("response:", json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const goToChannelScreen = (id, uri) => {
    navigation.navigate("Channel", { id, uri });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {channels.map((channel, index) => (
          <ListItem
            style={styles.listItem}
            key={index}
            onPress={() =>
              navigation.navigate("Channel", {
                id: channel.id,
                uri: channel.cmd,
              })
            }
            bottomDivider
          >
            <Avatar
              rounded
              source={{
                uri: "http://spacetv.in/images/" + channel.id + ".png",
              }}
            ></Avatar>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "800" }}>
                {channel.name}
              </ListItem.Title>
              <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                <Text style={{ opacity: 0.5, marginRight: 5 }}>
                  {channel?.epg_name}
                </Text>
              </ListItem.Subtitle>
            </ListItem.Content>
            <View style={styles.time_view}>
              <Text style={styles.time}>
                {moment(channel?.time).format("HH:mm")}
              </Text>
              <LinearProgress
                style={{ marginVertical: 10 }}
                value="0.5"
                variant="determinate"
              />
              <Text style={styles.time_to}>
                {moment(channel?.time_to).format("HH:mm")}
              </Text>
            </View>
          </ListItem>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },

  headerRight: {
    marginRight: 20,
  },
  time_view: {},
  time: {
    opacity: 0.5,
    marginRight: 5,
  },
  time_to: {
    opacity: 0.5,
  },
});

export default HomeScreen;
