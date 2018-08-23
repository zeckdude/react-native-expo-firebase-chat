import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';

import firebase from 'config/firebase';
import api from 'api';
import { isPopulated, isEmail } from 'helpers/validation';


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

  validateForm = () => {
    const {
      name, email, password, passwordConfirmation,
    } = this.state;
    const requiredFields = [
      {
        value: name,
        message: 'Please enter your name',
      },
      {
        value: email,
        message: 'Please enter your email address',
      },
      {
        value: password,
        message: 'Please enter your password',
      },
      {
        value: passwordConfirmation,
        message: 'Please confirm your password',
      },
    ];

    const errorMessage = requiredFields.reduce((errorString, field, index) => {
      if (!isPopulated(field.value)) {
        if (index === 0) { return field.message; }
        return `${errorString}\n${field.message}`;
      }
      return errorString;
    }, '');

    if (errorMessage.length) {
      debugger;
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

    const isFormValid = this.validateForm();
    if (!isFormValid) {
      // this.setState({ isLoading: false });
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
        const errorCode = error.code;
        const errorMessage = error.message;
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
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#4f4e4e"
            returnKeyType="next"
            ref={(input) => { this.nameInput = input; }}
            onSubmitEditing={() => this.emailInput.focus()}
          />
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            style={styles.input}
            placeholderTextColor="#4f4e4e"
            returnKeyType="next"
            ref={(input) => { this.emailInput = input; }}
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
          />
          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#4f4e4e"
            ref={(input) => { this.passwordInput = input; }}
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType="next"
          />
          <TextInput
            value={this.state.passwordConfirmation}
            onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor="#4f4e4e"
            returnKeyType="go"
            ref={(input) => { this.passwordConfirmationInput = input; }}
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={this.onSubmitRegistration}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
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
