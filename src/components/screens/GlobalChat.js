import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import api from 'api';

class GlobalChat extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    api.loadMessages((message) => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    });
  }

  componentWillUnmount() {
    api.closeChat();
  }

  render() {
    const { messages } = this.state;
    const { name } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={(message) => {
            api.sendMessage(message);
          }}
          user={{
            _id: api.getUid(),
            name,
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
});
export default GlobalChat;
