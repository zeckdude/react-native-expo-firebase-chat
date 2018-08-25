import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from 'shared/Button';
import TextInput from 'shared/TextInput';

import firebase from 'config/firebase';
import api from 'api';
import validateForm from 'helpers/validation';


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
      isLoading: false,
    };
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        api.dbRef
          .child('users')
          .push({
            email: user.email,
            uid: user.uid,
            name: this.state.name,
          });
        this.props.navigation.navigate('MainMenu');
        this.setState({
          isLoading: false,
        });
      }
    });
  }

  runValidation = () => {
    const {
      name, email, password, passwordConfirmation,
    } = this.state;

    const fields = [
      {
        value: name,
        verify: [{
          type: 'isPopulated',
          message: 'Please enter your name',
        }],
      },
      {
        value: email,
        verify: [
          {
            type: 'isPopulated',
            message: 'Please enter your email address',
          },
          {
            type: 'isEmail',
            message: 'Please format your email address correctly',
          },
        ],
      },
      {
        value: password,
        verify: [
          {
            type: 'isPopulated',
            message: 'Please enter your password',
          },
          {
            type: 'isMatched',
            matchValue: passwordConfirmation,
            message: 'Password and Confirmation must match',
          },
          {
            type: 'isGreaterThanLength',
            length: 5,
            message: 'Password must be at least six characters',
          },
        ],
      },
      {
        value: passwordConfirmation,
        verify: [{
          type: 'isPopulated',
          message: 'Please confirm your password',
        }],
      },
    ];

    const errorMessage = validateForm(fields);
    if (errorMessage) {
      showMessage({
        message: 'Check your form',
        description: errorMessage,
        type: 'danger',
      });

      return false;
    }

    return true;
  }

  onSubmitRegistration = () => {
    const { email, password } = this.state;

    const isFormValid = this.runValidation();
    if (!isFormValid) {
      return;
    }

    this.setState({ isLoading: true });

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate('MainMenu');
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        showMessage({
          message: 'Check your form',
          description: `${error.message} (${error.code})`,
          type: 'danger',
        });
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <ScrollView behavior="padding" contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16a085" />
        <View style={styles.logoContainer}>
          <Icon
            name="user-circle-o"
            type="font-awesome"
            size={100}
            color="#bdede3"
          />
          <Text style={styles.subtext}>Join Chat-a-lot</Text>
        </View>
        <KeyboardAvoidingView style={styles.signupFormContainer}>
          <TextInput
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            placeholder="Name"
            ref={(input) => { this.nameInput = input; }}
            onSubmitEditing={() => this.emailInput.focus()}
          />
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            ref={(input) => { this.emailInput = input; }}
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType="email-address"
            placeholder="Email Address"
          />
          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry
            ref={(input) => { this.passwordInput = input; }}
            onSubmitEditing={() => this.passwordInput.focus()}
          />
          <TextInput
            value={this.state.passwordConfirmation}
            onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
            placeholder="Confirm Password"
            secureTextEntry
            returnKeyType="go"
            ref={(input) => { this.passwordConfirmationInput = input; }}
          />
        </KeyboardAvoidingView>
        <Button onPress={this.onSubmitRegistration}>SIGN UP</Button>
        <Spinner visible={this.state.isLoading} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16a085',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  signupFormContainer: {
    // flex: 1,
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#4f4e4e',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
  },
  subtext: {
    color: '#ffffff',
    fontSize: 25,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
  error: {
    margin: 8,
    marginBottom: 0,
    color: 'red',
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('Register', () => Register);
