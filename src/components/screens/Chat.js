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
    console.log(this.user);
    const { uid } = this.props.navigation.state.params;

    console.log(this.generateChatId(uid));
    // debugger;

    this.chatRef = api.dbRef.child(`chat/${this.generateChatId(uid)}`);
    this.chatRefData = this.chatRef.orderByChild('order');
  }

  componentDidMount() {
    this.liveUpdateMessages(this.chatRefData);
  }

  componentWillUnmount() {
    this.chatRefData.off();
  }

  /**
   * Firebase command to add the message to the messages property for the chat
   * @param  {Array}  [messages [Array of messages that are sent when the user hits Send (Not sure why its an array when it just sends one message anyways)]
   * @return {void}
   */
  onSend = (messages) => {
    const now = new Date().getTime();
    this.chatRef.push({
      _id: now,
      text: messages[0].text,
      createdAt: now,
      uid: this.user.uid,
      order: -1 * now,
    });
  }

  /**
   * Firebase socket connection that will run every time a message is added/removed from the messages property for the chat
   * @param  {[type]} chatRef [description]
   * @return {[type]}         [description]
   */
  liveUpdateMessages = (chatRef) => {
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
