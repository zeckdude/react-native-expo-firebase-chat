import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import api from 'api';
import IconTitleSet from 'shared/IconTitleSet';
import { signOutApp } from '../../auth';

export default class MainMenu extends Component {
  render() {
    return (
      <View style={styles.containerl}>
        <StatusBar barStyle="light-content" backgroundColor="#00796B" />
        <IconTitleSet
          iconName="chat"
          iconSize={100}
          iconColor="#bdede3"
          style={styles.iconTitleSet}
        >
          Welcome
        </IconTitleSet>
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
            Contacts
          </Text>
        </TouchableOpacity>
        <Button
          primary
          title="Logout"
          onPress={() => {
            api.signOutFirebase()
              .then(
                () => {
                  signOutApp().then(() => this.props.navigation.navigate('SignedOutStack'));
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
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 80,
  },
});
