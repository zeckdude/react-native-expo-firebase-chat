import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import api from 'api';

export default class UsersList extends Component {
  static navigationOptions = {
    headerRight: (
      <Button
        primary
        title="Logout"
        onPress={() => {
          api.signOut()
            .then(
              () => {
                this.props.navigation.navigate('Login');
              },
              (error) => {
                // An error happened.
              },
            );
        }}
      >
        Log out
      </Button>
    ),
  };

  state = {
    users: [],
    loading: true,
  };

  constructor(props) {
    super(props);
    this.usersRef = api.dbRef.child('users');
  }

  componentDidMount() {
    this.listenForItems(this.usersRef);
  }

  listenForItems = (usersRef) => {
    const user = api.currentUser;

    usersRef.on('value', (snap) => {
      // get children as an array
      const users = [];
      snap.forEach((child) => {
        if (child.val().email != user.email) {
          users.push({
            name: child.val().name,
            uid: child.val().uid,
            email: child.val().email,
          });
        }
      });

      this.setState({
        users,
        loading: false,
      });
    });
  }

  renderRow = ({ item }) => {
    const { name, email, uid } = item;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Chat', {
            name,
            email,
            uid,
          });
        }}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: 'https://www.gravatar.com/avatar/',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topGroup}>
          <Text style={styles.user}>Users</Text>
        </View>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
        />
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginRight: 10,
    marginLeft: 10,
  },
  rightButton: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    padding: 0,
  },
  topGroup: {
    flexDirection: 'row',
    margin: 10,
  },
  users: {
    flex: 1,
    color: '#3A5BB1',
    fontSize: 16,
    padding: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 6,
    marginBottom: 8,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 6,
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16,
  },
});
