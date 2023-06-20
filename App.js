import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {

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
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;