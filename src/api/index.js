/* eslint class-methods-use-this: 0 */

import { snapshotToArray } from 'helpers';
import firebase from '../lib/firebase';

class API {
  uid = '';

  messagesRef = null;

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUid(user.uid);
        this.setDbRef();
        this.setCurrentUser();
      }
    });
  }

  setDbRef() {
    this.dbRef = firebase.database().ref();
  }

  setCurrentUser() {
    this.currentUser = firebase.auth().currentUser;
  }

  setUid(value) {
    this.uid = value;
  }

  getUid() {
    return this.uid;
  }

  // retrieve the messages from the Backend
  loadMessages(callback) {
    this.messagesRef = firebase.database().ref('messages');
    this.messagesRef.off();
    const onReceive = (data) => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    this.messagesRef.limitToLast(20).on('child_added', onReceive);
  }

  // send the message to the Backend
  sendMessage(message) {
    for (let i = 0; i < message.length; i++) {
      this.messagesRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }
  }

  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }

  signOutFirebase() {
    return firebase.auth().signOut();
  }

  sendPasswordResetEmail(email) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email);
  }

  /**
   * Get detailed information about all rooms for a specified user
   * @param  {String}  userId
   * @return {Promise} An array of objects with detailed information about each room
   */
  getRoomsByUserId = async (userId) => {
    // Get the room ids for the user
    const roomIds = await this.getUserRoomIds(userId);

    // Get detailed information about each room by its id
    return this.getRoomsByIds(roomIds);
  }

  /**
   * Get detailed information about each room id in a list
   * @param  {Array}  roomIds
   * @return {Promise} An array of objects with detailed information about each room
   */
  getRoomsByIds = async roomIds => Promise.all(roomIds.map(async (roomId) => {
    // Get the user ids of all the users in the current room in the loop
    const roomUserIds = await this.getRoomUserIds(roomId);

    // Get detailed information about each user by their id
    const users = await this.getUsersByIds(roomUserIds);

    return {
      id: roomId,
      users,
    };
  }));

  /**
   * Get the user ids for the users in a specified room
   * @param  {String}  roomId
   * @return {Promise} An array of all the users ids of the users in the room
   */
  getRoomUserIds = async (roomId) => {
    const roomUserIdsSnap = await this.dbRef.child(`roomUsers/${roomId}`).once('value');
    return snapshotToArray(roomUserIdsSnap);
  }

  /**
   * Get the rooms for a specified user
   * @param  {String}  userId
   * @return {Promise}  An array of all the room ids that a user is in
   */
  getUserRoomIds = async (userId) => {
    const userRoomsRef = this.dbRef.child(`userRooms/${userId}`);
    const userRoomsSnap = await userRoomsRef.once('value');
    return snapshotToArray(userRoomsSnap);
  }

  /**
   * Get detailed information about each user id in a list
   * @param  {Array]  userIds
   * @return {Promise}  An array of objects with detailed information about each user
   */
  getUsersByIds = async userIds => Promise.all(userIds.map(async (userId) => {
    // Get the user's name that matches the id for the user
    const userSnap = await this.dbRef.child(`users/${userId}`).once('value');
    const user = userSnap.val();

    return {
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      uid: userId,
    };
  }));

  /**
   * Create room name by the following priority
   * 1. An assigned room name
   * 2. A comma separated list of all the user's names in the room
   * @param  {Object} room  Detailed information about a room
   * @param  {Array}  [userIds=[]] An array of user ids with which to filter out users
   * @return {String} Assigned room name or Comma separated list of all users
   */
  getRoomName = (room, userIdsToFilterOut = []) => room.name || room.users
    .filter(({ uid }) => !userIdsToFilterOut.includes(uid))
    .map(({ name }) => name)
    .join(', ')


  setOrIncrementUnreadMessageCount = ({ roomId, userIds, isCountBeingReset }) => {
    userIds.forEach((userId) => {
      const userUnreadMessagesRef = this.dbRef.child(`unreadMessagesCount/${roomId}/${userId}`);
      userUnreadMessagesRef.transaction(currentCount => (isCountBeingReset ? 0 : (currentCount || 0) + 1));
    });
  }

  /**
   * Save this chat room to the userRooms collection for all specified user ids
   */
  setUsersRoom = (chatRoomId, userIds) => {
    const userRoomsRef = this.dbRef.child('userRooms');

    const userData = userIds.reduce((usersRoom, userId) => ({
      ...usersRoom,
      [userId]: {
        [userRoomsRef.push().key]: chatRoomId,
      },
    }), {});

    // Example structure being created
    // userRoomsRef.update({
    //   [api.currentUser.uid]: {
    //     [userRoomsRef.push().key]: chatRoomId,
    //   },
    //   [this.selectedUser.uid]: {
    //     [userRoomsRef.push().key]: chatRoomId,
    //   },
    // });

    userRoomsRef.update(userData);
  }

  /**
   * Save the users for this chat room to the roomUsers collection
   */
  setRoomUsers = (chatRoomId, userIds) => {
    const roomUsersRef = this.dbRef.child(`roomUsers/${chatRoomId}`);

    const roomData = userIds.reduce((roomUsers, userId) => ({
      ...roomUsers,
      [roomUsersRef.push().key]: userId,
    }), {});

    roomUsersRef.update(roomData);

    // Example structure being created
    // roomUsersRef.update({
    //   [roomUsersRef.push().key]: api.currentUser.uid,
    //   [roomUsersRef.push().key]: this.selectedUser.uid,
    // });
  }
}

export default new API();
