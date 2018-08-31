import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import api from 'api';
import firebase from 'config/firebase';
import Wrapper from 'screens/Wrapper';
import IconTitleSet from 'shared/IconTitleSet';
import Button from 'shared/Button';
import { getGravatarSrc } from 'helpers';

export default class UsersList extends Component {
  state = {
    users: [],
    isLoading: true,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.listenForItems(currentUser);
      }
    });
  }

  listenForItems = (currentUser) => {
    const allUsers = api.dbRef.child('users');

    allUsers.on('value', (snap) => {
      // get children as an array
      const users = [];
      snap.forEach((userSnapshot) => {
        const user = userSnapshot.val();
        if (user.email !== currentUser.email) {
          users.push({
            name: user.name,
            uid: user.uid,
            email: user.email,
          });
        }
      });

      this.setState({
        users,
        isLoading: false,
      });
    });
  }

  renderRow = ({ item }) => {
    const { name, email, uid } = item;
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Chat', {
          name,
          email,
          uid,
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
