import { getAuth, signInAnonymously } from "firebase/auth";
import { useState } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState(''); //input text setting
  const [color, setColor] = useState(""); //setting background color for the chat page
  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", { userID: result.user.uid, color: color, name: name });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  return (
    <ImageBackground source={require('../assets/background-image.png')} resizeMode='cover' style={styles.flex}>
      {/* adjust height of the page based on the keyboard height*/}
      <View style={styles.container}>

        {/* title holder */}
        <View style={styles.flex}>
          <Text style={styles.title}>App Title</Text>
        </View>

        {/* container with a text input field and buttons */}
        <View style={styles.formHolder}>
          <TextInput
            style={[styles.formComponents, styles.textSize, styles.textInput]}
            value={name}
            onChangeText={setName}
            placeholder='Your Name'
          />

          <View>
            <Text style={[styles.formText, styles.textSize]}>Choose Background Color:</Text>
            <View style={styles.radioList}>
              <TouchableOpacity
                style={[styles.formComponents, styles.radioButton, { backgroundColor: "#090C08" }]}
                onPress={() => setColor("#090C08")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.formComponents, styles.radioButton, { backgroundColor: "#474056" }]}
                onPress={() => setColor("#474056")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.formComponents, styles.radioButton, { backgroundColor: "#8A95A5" }]}
                onPress={() => setColor("#8A95A5")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.formComponents, styles.radioButton, { backgroundColor: "#B9C6AE" }]}
                onPress={() => setColor("#B9C6AE")}
              ></TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.formComponents, styles.button]}
            onPress={signInUser}
          >
            <Text style={[styles.title, styles.textSize]}> Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* adjust height of the page based on the keyboard height*/}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6%',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textSize: {
    fontSize: 16,
  },
  // container with a text input field and buttons
  formHolder: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    padding: '6%',
  },
  // general styles for the input and the buttons
  formComponents: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    padding: 10,
  },
  formText: {
    color: '#757083',
    marginBottom: 10,
  },
  radioList: {
    display: 'flex',
    flexDirection: 'row'
  },
  radioButton: {
    width: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#757083',
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#757083',
  }
});

export default Start;