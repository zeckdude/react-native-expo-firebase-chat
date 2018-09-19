import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  intersection, keyBy,
} from 'lodash';
import api from 'api';
import { snapshotToArray } from 'helpers';
import BackButton from '../shared/BackButton';

export default class ChatRoom extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerLeft: <BackButton navigation={navigation} runFunction={params.runFunction} />,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isNewChatRoom: false,
      numMessagesToShow: 20,
      numMessagesToIncrement: 20,
      isLoadEarlierVisible: false,
    };

    // These are required already for the first render so they must be defined here
    this.chatRoomId = this.props.navigation.state.params.roomId;
    this.selectedUsers = this.props.navigation.state.params.selectedUsers;
  }

  async componentDidMount() {
    this.roomUsers = await this.getRoomUsers();
    this.nonCurrentUserRoomUserIds = this.getOtherRoomUserIds(this.roomUsers);

    // Get reference to the chat room conversation or create a new chat room reference
    this.chatRoomRef = await this.getChatRoomRef();

    // Reset the unread messages count
    api.setOrIncrementUnreadMessageCount({
      roomId: this.chatRoomRef.key,
      userIds: [api.currentUser.uid],
      isCountBeingReset: true,
    });

    // Save the existing messages into state and update them if a message is added/removed from the DB
    this.liveUpdateListener = this.liveUpdateMessages(this.chatRoomRef.child('messages').limitToLast(this.state.numMessagesToShow));
  }

  componentDidUpdate(prevProps, prevState) {
    // If the number of messages to show has changed, remove the old listener and run the event listener again
    if (prevState.numMessagesToShow !== this.state.numMessagesToShow) {
      this.chatRoomRef.off(this.liveUpdateListener);
      this.liveUpdateMessages(this.chatRoomRef.child('messages').limitToLast(this.state.numMessagesToShow));
    }

    // If the messages change, check if the number returned is equal to the number requested. If it is not,
    // then that means there are no more messages coming after that and we can hide the `load earlier` button.
    if (prevState.messages !== this.state.messages) {
      this.toggleLoadEarlierButton(this.state.messages);
    }
  }

  componentWillUnmount() {
    // Remove all event listeners on reference
    this.chatRoomRef.off();
  }

  // Get an array of ids for all the users in the room that are not the current user
  getOtherRoomUserIds = roomUsers => Object.keys(roomUsers)
    .filter(userId => userId !== api.currentUser.uid);

  getChatRoomRef = async () => {
    // Get the chat room id that was passed to the chat (if it is provided)
    // Otherwise get the chat room based on the current user and the selected user
    let chatRoomId = await this.getChatRoomId();

    // If an existing room is not found, create a new push key as the room id
    if (!chatRoomId) {
      chatRoomId = api.dbRef.child('chatRooms').push().key;
      this.setState({
        isNewChatRoom: true,
      });
    }

    return api.dbRef.child(`chatRooms/${chatRoomId}`);
  }

  incrementNumMessagesToShow = (numMessagesToIncrement) => {
    this.setState(prevState => ({
      numMessagesToShow: prevState.numMessagesToShow + numMessagesToIncrement,
    }));
  }

  /**
   * If this is the first message for a room, then save the following data:
   * Save users to the roomUsers collection for this room
   * Save the room to the userRooms collection for each of the users in the room
   * @return {void}
   */
  createNewRoomData = () => {
    const roomUserIds = Object.keys(this.roomUsers);

    api.setRoomUsers(this.chatRoomRef.key, roomUserIds);
    api.setUsersRoom(this.chatRoomRef.key, roomUserIds);

    this.setState({
      isNewChatRoom: false,
    });
  }

  // Identify the room as a personal chat room (one on one)
  // TODO: When chat rooms for more than 2 people are implemented, this logic needs to be altered
  setPersonalRoom = () => {
    this.chatRoomRef.set({
      isPersonal: true,
    });
  }

  getChatRoomId = async () => {
    // If the room id is already specified, use that
    if (this.chatRoomId) { return this.chatRoomId; }

    // Get the rooms for the current user
    const currentUserRoomIds = await api.getUserRoomIds(api.currentUser.uid);

    // Get the rooms for the user(s) that are not the current user
    const selectedUsersRoomIds = await Promise.all(this.selectedUsers.map(async user => api.getUserRoomIds(user.uid)));

    // Find the room they are all in together or return undefined
    return intersection(currentUserRoomIds, ...selectedUsersRoomIds)[0];
  }

  /**
   * Firebase command to add the message to the messages property for the chat room
   * @param  {Array}  messages [Array of messages that are sent when the user hits Send (Not sure why its an array when it just sends one message anyways)]
   * @return {void}
   */
  onSend = (messages) => {
    if (this.state.isNewChatRoom) {
      // Setup flag based on the number of people in this chat room
      this.setPersonalRoom();

      // If this is the first message in a new room, save the information about the users in the room
      this.createNewRoomData();
    }

    // Increment the unread messages count for users other than the current user
    api.setOrIncrementUnreadMessageCount({
      roomId: this.chatRoomRef.key,
      userIds: this.nonCurrentUserRoomUserIds,
    });

    // Increase the limit of messages that are requested from firebase realtime database
    this.incrementNumMessagesToShow(1);

    const now = new Date().getTime();
    const messageValues = {
      text: messages[0].text,
      createdAt: now,
      uid: api.currentUser.uid,
    };
    this.chatRoomRef.child('messages').push(messageValues);
  }

  /**
   * Hide the Load Earlier Visible Messages button if less messages are returned than are requested
   * The number of messages being requested is always a set amount more than the last set, so if
   * there are less than the number of requested messages, then that means there are no more to send.
   * @param  {Array} messages [Chat messages]
   * @return {void}
   */
  toggleLoadEarlierButton = (messages) => {
    this.setState(prevState => ({
      isLoadEarlierVisible: messages.length === prevState.numMessagesToShow,
    }));
  }

  getRoomUsers = async () => {
    let roomUsers;
    // If the conversation is coming from the contacts area, then the selected users are already known and we can build the room user data using that
    if (this.selectedUsers) {
      roomUsers = keyBy(this.selectedUsers, 'uid');
      // Add the current user
      roomUsers[api.currentUser.uid] = {
        name: api.currentUser.displayName,
        photoURL: api.currentUser.photoURL,
        email: api.currentUser.email,
        uid: api.currentUser.uid,
      };
    }

    // If the conversation is a previous one, then we know the chat room id and we can find the users within it
    if (this.chatRoomId) {
      const roomData = await api.getRoomsByIds([this.chatRoomId]);
      roomUsers = keyBy(roomData[0].users, 'uid');
    }

    return roomUsers;
  }

  /**
   * Firebase socket connection that will run every time a message is added/removed from the messages property for the chat room
   * @param  {Array} messagesRef [Firebase reference to the messages for this chat room]
   * @return {void}
   */
  liveUpdateMessages = (messagesRef) => {
    messagesRef.on('value', (messagesSnapshot) => {
      // Get all messages and re-map the array to a format that works for Gifted Chat component
      const messages = snapshotToArray(messagesSnapshot).map(message => ({
        _id: message.createdAt,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.uid,
          name: this.roomUsers[message.uid].name,
          avatar: this.roomUsers[message.uid].photoURL,
        },
      }));

      this.setState({
        messages: messages.reverse(),
      });
    });
  }

  render() {
    const { isLoadEarlierVisible, messages } = this.state;
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          onLoadEarlier={() => this.incrementNumMessagesToShow(this.state.numMessagesToIncrement)}
          user={{
            _id: api.currentUser.uid,
            name: api.currentUser.displayName,
            avatar: api.currentUser.photoURL,
          }}
          loadEarlier={isLoadEarlierVisible}
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
