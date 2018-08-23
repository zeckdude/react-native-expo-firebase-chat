import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import api from 'api';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.user = api.currentUser;
    const { uid } = this.props.navigation.state;

    this.chatRef = api.dbRef.child(`chat/${this.generateChatId(uid)}`);
    this.chatRefData = this.chatRef.orderByChild('order');
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    this.listenForItems(this.chatRefData);
  }

  componentWillUnmount() {
    this.chatRefData.off();
  }

  onSend = (messages = []) => {
    // this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    messages.forEach((message) => {
      const now = new Date().getTime();
      this.chatRef.push({
        _id: now,
        text: message.text,
        createdAt: now,
        uid: this.user.uid,
        order: -1 * now,
      });
    });
  }

  listenForItems = (chatRef) => {
    chatRef.on('value', (snap) => {
      // get children as an array
      const items = [];
      snap.forEach((child) => {
        items.push({
          _id: child.val().createdAt,
          text: child.val().text,
          createdAt: new Date(child.val().createdAt),
          user: {
            _id: child.val().uid,
          },
        });
      });

      this.setState({
        messages: items,
      });
    });
  }

  // generate ChatId works cause when you are the user sending
  // chat you take user.uid and your user takes uid
  // when your user is using the app to send message s/he takes
  // user.uid and you take the uid cause you are the user
  generateChatId = (uid) => {
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    return `${uid}-${this.user.uid}`;
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: this.user.uid,
        }}
      />
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'stretch',
//     marginRight: 10,
//     marginLeft: 10,
//   },
// });
