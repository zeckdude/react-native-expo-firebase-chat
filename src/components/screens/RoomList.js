import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import api from 'api';
import Wrapper from 'screens/Wrapper';
import IconTitleSet from 'shared/IconTitleSet';
import Button from 'shared/Button';
import { getGravatarSrc, snapshotToArray } from 'helpers';

export default class UserList extends Component {
  state = {
    rooms: [],
    isLoading: true,
  };

  componentDidMount() {
    this.liveUpdateRooms();
  }

  liveUpdateRooms = (currentUser) => {
    const allRooms = api.dbRef.child('chatRooms').orderByChild('isPersonal').equalTo(false);

    allRooms.on('value', (usersSnapshot) => {
      let users = snapshotToArray(usersSnapshot);
      users = snapshotToArray(usersSnapshot)
        .filter(user => user.email !== currentUser.email)
        .map(user => ({
          name: user.name,
          uid: user.id,
          email: user.email,
        }));

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
          selectedUser: {
            name,
            email,
            uid,
            photoURL: getGravatarSrc(email),
          },
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
