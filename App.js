// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import functions for initializing firestore
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { getStorage } from "firebase/storage";

// Create the navigator
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);



const App = () => {
  // to define a new state that represents the network connectivity status
  const connectionStatus = useNetInfo();

  // display an alert popup if connection is lost
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDbH-ZhkLqnLxeOKeQsWg3Vodp4f4TRSgk",
    authDomain: "chatapp-11312.firebaseapp.com",
    projectId: "chatapp-11312",
    storageBucket: "chatapp-11312.appspot.com",
    messagingSenderId: "424608095452",
    appId: "1:424608095452:web:aca81ed26e0b2b085fa819"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  // Initialize Firebase Storage handler
  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            {...props}
            storage={storage}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;