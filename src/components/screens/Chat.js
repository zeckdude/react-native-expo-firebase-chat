import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import api from 'api';
import { snapshotToArray } from 'helpers';
import firebase from 'config/firebase';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.user = api.currentUser;
    this.selectedUserId = this.props.navigation.state.params.uid;
  }

  async componentDidMount() {
    // Get reference to the chat conversation or create a new chat reference
    this.chatRef = await this.getChatRef();

    // Save the existing messages into state and update them if a message is added/removed from the DB
    this.liveUpdateMessages(this.chatRef.orderByChild('order'));
  }

  componentWillUnmount() {
    // Remove all event listeners on reference
    this.chatRef.off();
  }

  onceGetUserRooms = userId => api.dbRef.child(`userRooms/${userId}`).once('value');

  getChatRef = async () => {
    // Get the chat room id based on the current user and the selected user
    let chatRoomId = await this.getChatRoomId();

    // If there is no existing chat room, then create a new push key to make a reference to
    // Otherwise, use the found chat room id
    if (!chatRoomId) {
      chatRoomId = api.dbRef.child('chat').push().key;
      console.log('chatRoomId', chatRoomId);

      // Save this chat to the userRooms collection for both users
      const userRoomsRef = api.dbRef.child('userRooms');
      userRoomsRef.update({
        [this.user.uid]: {
          [userRoomsRef.push().key]: chatRoomId,
        },
        [this.selectedUserId]: {
          [userRoomsRef.push().key]: chatRoomId,
        },
      });

      // Save the users for this chat to the roomUsers collection
      const roomUsersRef = api.dbRef.child(`roomUsers/${chatRoomId}`);
      roomUsersRef.update({
        [roomUsersRef.push().key]: this.user.uid,
        [roomUsersRef.push().key]: this.selectedUserId,
      });
    }

    return api.dbRef.child(`chat/${chatRoomId}`);
  }

  getChatRoomId = async () => {
    // Get the rooms for the current user (userRooms)
    const currentUserRoomsSnapshot = await this.onceGetUserRooms(this.user.uid);
    const currentUserRooms = snapshotToArray(currentUserRoomsSnapshot);
    console.log('currentUserRooms', currentUserRooms);

    // Get the rooms for the user selected to chat with (userRooms)
    const selectedUserRoomsSnapshot = await this.onceGetUserRooms(this.selectedUserId);
    const selectedUserRooms = snapshotToArray(selectedUserRoomsSnapshot);
    console.log('selectedUserRooms', selectedUserRooms);

    // Get the rooms they are both in together
    const matchingRooms = currentUserRooms.filter(currentUserRoom => selectedUserRooms.includes(currentUserRoom));
    console.log('matchingRooms', matchingRooms);

    return matchingRooms[0];
  }

  /**
   * Firebase command to add the message to the messages property for the chat
   * @param  {Array}  [messages [Array of messages that are sent when the user hits Send (Not sure why its an array when it just sends one message anyways)]
   * @return {void}
   */
  onSend = (messages) => {
    const now = new Date().getTime();
    const messageValues = {
      _id: now,
      text: messages[0].text,
      createdAt: now,
      uid: this.user.uid,
      order: -1 * now,
    };
    this.chatRef.push(messageValues);
  }

  /**
   * Firebase socket connection that will run every time a message is added/removed from the messages property for the chat
   * @param  {[type]} chatRef [description]
   * @return {[type]}         [description]
   */
  liveUpdateMessages = (chatRef) => {
    chatRef.on('value', (messagesSnapshot) => {
      // get children as an array

      // Get all messages and re-map the array to a format that works for Gifted Chat component
      let messages = snapshotToArray(messagesSnapshot);
      messages = snapshotToArray(messagesSnapshot).map(message => ({
        _id: message.createdAt,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.uid,
        },
      }));

      this.setState({
        messages,
      });
    });
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
