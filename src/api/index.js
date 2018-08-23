/* eslint class-methods-use-this: 0 */

import firebase from '../config/firebase';

class API {
  uid = '';

  messagesRef = null;

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUid(user.uid);
        this.setDbRef();
        this.setCurrentUser();
      } else {
        // firebase
        //   .auth()
        //   .signInAnonymously()
        //   .catch(error => {
        //     alert(error.message);
        //   });
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

  signOut() {
    return firebase.auth().signOut();
  }

  sendPasswordResetEmail(email) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email);
  }
}

export default new API();
