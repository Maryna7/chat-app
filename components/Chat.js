import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const [messages, setMessages] = useState([]);
  const { name, color, userID } = route.params;

  // The code for caching the chat
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setLists(JSON.parse(cachedMessages));
  }

  // setting the state with a static message for being able to see each element of the UI displayed on the screen right away
  let unsubMessages;

  useEffect(() => {
    if (isConnected === true) {
      navigation.setOptions({ title: name });
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);


  // that's called when a user sends a message
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  }

  //  Change background bubble color
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // when offline users can’t compose new messages
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  // function is responsible for creating the circle button
  const renderCustomActions = (props) => {
    return <CustomActions {...props} storage={storage} userID={userID} />;
  };

  // function is responsible for checking if the currentMessage contains location data
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{ _id: userID, name }}
      />
      {/* adjust height of the page based on the keyboard height*/}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default Chat;