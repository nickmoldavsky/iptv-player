import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import localStorage from "../helpers/LocalStorageHelper";

const SettingsScreen = ({ navigation }) => {
  const [key, setKey] = useState("");

  useEffect(() => {
    localStorage.getLocalStorageData("KEY").then((item) => {
      if (item !== null) {
        console.log("local storage key:", item);
      } else {
      }
    });
  }, [navigation]);

  const saveSettings = () => {
    localStorage.storeLocalStorageData(key).then(() => {
      navigation.navigate("Home");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>
      <TextInput
        style={styles.textInput}
        value={key}
        onChangeText={setKey}
        placeholder="KEY"
      />
      <TextInput style={styles.textInput} placeholder="URI" />
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={saveSettings}
      >
        <Text style={styles.textStyle}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "white",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    height: 35,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
});

export default SettingsScreen;
