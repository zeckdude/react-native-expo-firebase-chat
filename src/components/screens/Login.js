import React, { Component } from 'react';
import {
  AppRegistry,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from 'shared/Button';

import firebase from 'config/firebase';

export default class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('MainMenu');
        this.setState({
          isLoading: false,
        });
      }
    });
  }

  onLoginPress = () => {
    this.setState({ isLoading: true });
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showMessage({
          message: 'Check your form',
          description: `${error.message} (${error.code})`,
          type: 'danger',
        });
        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16a085" />
        <View style={styles.logoContainer}>
          <Icon
            name="chat"
            size={100}
            color="#bdede3"
          />
          <Text style={styles.subtext}>Chat-a-lot</Text>
        </View>
        <KeyboardAvoidingView style={styles.loginformContainer}>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#4f4e4e"
            style={styles.input}
            returnKeyType="next"
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#4f4e4e"
            style={styles.input}
            returnKeyType="go"
            secureTextEntry
            ref={(input) => { this.passwordInput = input; }}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <Button onPress={this.onLoginPress}>LOGIN</Button>
        </KeyboardAvoidingView>
        <Button
          onPress={() => this.props.navigation.navigate('Register')}
          style={styles.signUpButton}
        >
          Sign up
        </Button>
        <Button onPress={() => this.props.navigation.navigate('ForgetPassword')}>Forget Password</Button>
        <Spinner visible={this.state.isLoading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16a085',
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  subtext: {
    color: '#ffffff',
    fontSize: 25,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
  loginformContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#4f4e4e',
    paddingHorizontal: 10,
  },
  signUpButton: {
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
  },
  error: {
    margin: 8,
    marginBottom: 0,
    color: 'red',
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('Login', () => Login);
