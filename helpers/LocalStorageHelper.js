import AsyncStorage from "@react-native-async-storage/async-storage";

const localStorageHelper = {
    getFormattedDatetime: (datetime) => {
      return moment.utc(datetime).local().format('MMM Do, YYYY, h:mm a');
      //return true;
    },

    getLocalStorageData: async (item) => {
      try {
        const value = await AsyncStorage.getItem(item);
        if (value !== null) {
          console.log("local storage value:", value);
          return value;
        } else {
          //setModalVisible(true);
          return value;
        }
      } catch (e) {
        // error reading value
      }
    },
  
     storeLocalStorageData: async (value) => {
      try {
        await AsyncStorage.setItem("KEY", value);
        
      } catch (e) {
        console.error(e);
      }
    }
  
  }
  
  export default localStorageHelper;