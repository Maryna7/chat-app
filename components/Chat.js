import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { useState, useEffect } from 'react';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const { name, color, userID } = route.params;


  // setting the state with a static message for being able to see each element of the UI displayed on the screen right away
  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      });
      setMessages(newMessages);
    });

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

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

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
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