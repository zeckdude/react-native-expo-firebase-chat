import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import api from 'api';
// import { snapshotToArray } from 'helpers';

export default class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Duuuude',
    };

    // const user = firebase.auth().currentUser;
    //  self = this;
    // debugger;

    // firebase
    //   .database()
    //   .ref()
    //   .child('users/')
    //   .orderByChild("uid")
    //   .equalTo(user.uid)
    //   .once('value')
    //   .then(function(snapshot) {
    //     const userData = snapshotToArray(snapshot);
    //     console.log(userData);
    //     self.setState({
    //       name: userData[0].name
    //     });
    //   });
  }

  render() {
    return (
      <View style={styles.containerl}>
        <StatusBar barStyle="light-content" backgroundColor="#00796B" />
        <Text style={styles.title}>
Welcome
          {this.state.name}
!
        </Text>
        <TouchableOpacity>
          <Text
            style={styles.buttonStyle}
            onPress={() => this.props.navigation.navigate('GlobalChat', {
              name: this.state.name,
            })}
          >
            Chat Room
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={styles.buttonStyle}
            onPress={() => this.props.navigation.navigate('UserList')}
          >
            User List
          </Text>
        </TouchableOpacity>
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
                  throw error;
                },
              );
          }}
        >
          Log out
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20,
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
  },
  buttonStyle: {
    marginLeft: 20,
    margin: 20,
  },
  containerl: {
    flex: 1,
  },
});

AppRegistry.registerComponent('MainMenu', () => MainMenu);
