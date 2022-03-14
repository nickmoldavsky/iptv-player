import React, { Component, useEffect, useState, useRef } from "react";
import { View, StyleSheet, Button, Text, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar, ListItem } from "react-native-elements";
import { Video, AVPlaybackStatus } from "expo-av";

const ChannelScreen = ({ navigation, route }) => {
  let cmd = route.params.uri;
  cmd = cmd.replace("Y52PHBK6TC", "RG1USWKCQN");
  console.log('cmd', cmd);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [uri, setUri] = useState(cmd);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    video.current.playAsync();
    fetchApiCall();
  }, []);

  const playStream = (uri) => {
    uri = uri.replace("Y52PHBK6TC", "RG1USWKCQN");
    setUri(uri);
    video.current.playAsync();
  };

  const fetchApiCall = async () => {
    try {
      const response = await fetch(
        "http://188.166.0.142/ionic/postResponse.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newName: "",
            id: route.params.id,
          }),
        }
      );
      const result = await response.json();
      setChannels(result);
    } catch (error) {
      console.error("fetchApiCall error:", error);
    }
  };

  //console.log("onPlaybackStatusUpdate loaded:", status);
  //console.log("onPlaybackStatusUpdate loaded:", status.isLoaded);
  //console.log("onPlaybackStatusUpdate buffering:", status.isBuffering);
  //console.log("onPlaybackStatusUpdate playing:", status.isPlaying);

  if (
    status.isLoaded &&
    !status.isBuffering &&
    !status.shouldPlay &&
    !status.isPlaying
  ) {
    console.log("is loaded but not playing!");
    //video.current.playAsync();
  }

  return (
    <View style={styles.container}>
      <Video
        usePoster="true"
        posterSource={{
          uri: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102014/tv_logo.png",
        }}
        ref={video}
        style={styles.video}
        source={{
          uri: uri,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <View style={styles.current_epg}>
        <Text style={styles.current_epg_text}>{channels[0]?.name}</Text>
      </View>
      <ScrollView>
        {Object.keys(channels).map((channel, index) => (
          <ListItem
            style={styles.listItem}
            key={index}
            onPress={() => playStream(channels)}
            bottomDivider
          >
            <FontAwesome name="play-circle" size={15} color="#2C6BED" />
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: "800" }}>
                {channels[channel]?.name}
              </ListItem.Title>
              <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                <Text style={{ opacity: 0.5, marginRight: 5 }}>
                  {channels[channel]?.time}
                </Text>
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 230,
    backgroundColor: "black",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 70,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative",
    backgroundColor: "#fff",
  },
  title: {
    color: "#f90",
  },
  current_epg: {
    height: 25,
    justifyContent: "center",
    paddingLeft: 15,
    backgroundColor: "black",
  },
  current_epg_text: {
    color: "white",
  },
});

export default ChannelScreen;
