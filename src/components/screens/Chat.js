import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import api from 'api';
import { snapshotToArray } from 'helpers';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isNewChatRoom: false,
      numMessagesToShow: 20,
    };

    this.user = api.currentUser;
    this.selectedUser = this.props.navigation.state.params.selectedUser;

    console.log('this.user', this.user);
    console.log('this.selectedUser', this.selectedUser);
  }

  async componentDidMount() {
    // Get reference to the chat room conversation or create a new chat room reference
    this.chatRoomRef = await this.getChatRoomRef();

    // Track the messages count
    this.liveUpdateMessagesCount();

    // Save the existing messages into state and update them if a message is added/removed from the DB
    this.liveUpdateListener = this.liveUpdateMessages(this.chatRoomRef.child('messages').limitToLast(this.state.numMessagesToShow));
  }

  componentDidUpdate(prevProps, prevState) {
    // If the number of messages to show has changed, remove the old listener and run the event listener again
    if (prevState.numMessagesToShow !== this.state.numMessagesToShow) {
      this.chatRoomRef.off(this.liveUpdateListener);
      this.liveUpdateMessages(this.chatRoomRef.child('messages').limitToLast(this.state.numMessagesToShow));
    }
  }

  componentWillUnmount() {
    // Remove all event listeners on reference
    this.chatRoomRef.off();
  }

  onceGetUserRooms = userId => api.dbRef.child(`userRooms/${userId}`).once('value');

  getChatRoomRef = async () => {
    // Get the chat room id based on the current user and the selected user
    let chatRoomId = await this.getChatRoomId();

    if (!chatRoomId) {
      chatRoomId = api.dbRef.child('chatRooms').push().key;
      this.setState({
        isNewChatRoom: true,
      });
    }

    console.log('chatRoomId', chatRoomId);
    return api.dbRef.child(`chatRooms/${chatRoomId}`);
  }

  incrementNumMessagesToShow = (numIncrement) => {
    // debugger;
    this.setState(prevState => ({
      numMessagesToShow: prevState.numMessagesToShow + numIncrement,
    }));
  }

  /**
   * Save this chat room to the userRooms collection for both users
   */
  setUsersRoom = (chatRoomId) => {
    const userRoomsRef = api.dbRef.child('userRooms');
    userRoomsRef.update({
      [this.user.uid]: {
        [userRoomsRef.push().key]: chatRoomId,
      },
      [this.selectedUser.uid]: {
        [userRoomsRef.push().key]: chatRoomId,
      },
    });
  }

  /**
   * Save the users for this chat room to the roomUsers collection
   */
  setRoomUsers = (chatRoomId) => {
    const roomUsersRef = api.dbRef.child(`roomUsers/${chatRoomId}`);
    roomUsersRef.update({
      [roomUsersRef.push().key]: this.user.uid,
      [roomUsersRef.push().key]: this.selectedUser.uid,
    });
  }

  /**
   * If this is the first message for a room, then save the following data:
   * Save users to the roomUsers collection for this room
   * Save the room to the userRooms collection for each of the users in the room
   * @return {void}
   */
  createRoomData = () => {
    if (this.state.isNewChatRoom) {
      this.setRoomUsers(this.chatRoomRef.key);
      this.setUsersRoom(this.chatRoomRef.key);

      this.setState({
        isNewChatRoom: false,
      });
    }
  }

  incrementMessageCount = () => {
    const messagesCountRef = this.chatRoomRef.child('numMessages');
    messagesCountRef.transaction(currentNumMessages => (currentNumMessages || 0) + 1);
  }

  // Identify the room as a personal chat room (one on one)
  // TODO: When chat rooms for more than 2 people are implemented, this logic needs to be altered
  setupChatRoom = () => {
    if (this.state.isNewChatRoom) {
      this.chatRoomRef.set({
        isPersonal: true,
      });
    }
  }

  getChatRoomId = async () => {
    // Get the rooms for the current user (userRooms)
    const currentUserRoomsSnapshot = await this.onceGetUserRooms(this.user.uid);
    const currentUserRooms = snapshotToArray(currentUserRoomsSnapshot);
    console.log('currentUserRooms', currentUserRooms);

    // Get the active rooms for the user(s) that are not the current user (userRooms)
    const selectedUserRoomsSnapshot = await this.onceGetUserRooms(this.selectedUser.uid);
    const selectedUserRooms = snapshotToArray(selectedUserRoomsSnapshot);
    console.log('selectedUserRooms', selectedUserRooms);

    // Get the rooms they are both in together
    const matchingRooms = currentUserRooms.filter(currentUserRoom => selectedUserRooms.includes(currentUserRoom));
    console.log('matchingRooms', matchingRooms);

    return matchingRooms[0];
  }

  /**
   * Firebase command to add the message to the messages property for the chat room
   * @param  {Array}  messages [Array of messages that are sent when the user hits Send (Not sure why its an array when it just sends one message anyways)]
   * @return {void}
   */
  onSend = (messages) => {
    // Setup flag based on the number of people in this chat room
    this.setupChatRoom();

    // If this is the first message in a new room, save the information about the users in the room
    this.createRoomData();

    //  Increment the messages count. It's important to keep this saved so the count is known without having to get all documents in the collection.
    this.incrementMessageCount();

    this.incrementNumMessagesToShow(1);

    const now = new Date().getTime();
    const messageValues = {
      text: messages[0].text,
      createdAt: now,
      uid: this.user.uid,
    };
    this.chatRoomRef.child('messages').push(messageValues);
  }

  /**
   * Firebase socket connection that will run every time a message is added/removed from the messages property for the chat room
   * @param  {Array} messagesRef [Firebase reference to the messages for this chat room]
   * @return {void}
   */
  liveUpdateMessages = (messagesRef) => {
    const roomUsersInfo = {
      [this.user.uid]: {
        name: this.user.displayName,
        photoURL: this.user.photoURL,
      },
      [this.selectedUser.uid]: {
        name: this.selectedUser.name,
        photoURL: this.selectedUser.photoURL,
      },
    };

    messagesRef.on('value', (messagesSnapshot) => {
      // Get all messages and re-map the array to a format that works for Gifted Chat component
      const messages = snapshotToArray(messagesSnapshot).map(message => ({
        _id: message.createdAt,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.uid,
          name: roomUsersInfo[message.uid].name,
          avatar: roomUsersInfo[message.uid].photoURL,
        },
      }));

      this.setState({
        messages: messages.reverse(),
      });
    });
  }

  liveUpdateMessagesCount = () => {
    this.chatRoomRef.child('numMessages').on('value', (numMessagesSnapshot) => {
      this.setState({
        numMessages: numMessagesSnapshot.val(),
      });
    });
  }

  render() {
    const { numMessages, messages } = this.state;
    // debugger;
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          onLoadEarlier={() => this.incrementNumMessagesToShow(20)}
          user={{
            _id: this.user.uid,
            name: this.user.displayName,
            avatar: this.user.photoURL,
          }}
          loadEarlier={numMessages > messages.length}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
