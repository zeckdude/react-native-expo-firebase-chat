import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import api from 'api';
import firebase from 'lib/firebase';
import Wrapper from 'screens/Wrapper';
import IconTitleSet from 'shared/IconTitleSet';
import Button from 'shared/Button';
import { getGravatarSrc, snapshotToArray } from 'helpers';

export default class UsersList extends Component {
  state = {
    users: [],
    isLoading: true,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.getAllUsers(currentUser);
      }
    });
  }

  getAllUsers = async (currentUser) => {
    const allUsers = api.dbRef.child('users');

    const allUsersSnapshot = await allUsers.once('value');
    const users = snapshotToArray(allUsersSnapshot)
      .filter(user => user.email !== currentUser.email)
      .map(user => ({
        name: user.name,
        uid: user.id,
        email: user.email,
        photoURL: user.photoURL,
      }));

    this.setState({
      users,
      isLoading: false,
    });
  }

  getUserRooms = (user) => {
    const userRooms = api.dbRef.child(`userRooms/${user.id}`);
    return userRooms.once('value');
  }

  renderRow = ({ item }) => {
    const {
      name, email, uid, photoURL,
    } = item;
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Chat', {
          selectedUsers: [{
            name,
            email,
            uid,
            photoURL,
          }],
        })}
        style={styles.userButton}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: getGravatarSrc(email),
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{name}</Text>
        </View>
      </Button>
    );
  };

  render() {
    return (
      <Wrapper isLoading={this.state.isLoading}>
        <View style={styles.container}>
          <IconTitleSet
            iconName="users"
            iconType="font-awesome"
            style={styles.iconTitleSet}
          >
            Contacts
          </IconTitleSet>
          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={user => user.uid}
            style={{ flex: 1 }}
          />
        </View>
      </Wrapper>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconTitleSet: {
    marginBottom: 20,
  },
  userButton: {
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  profileName: {
    marginLeft: 6,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
});
