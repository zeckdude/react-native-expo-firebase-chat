import React, { Component } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { showMessage } from 'react-native-flash-message';
import Button from 'shared/Button';
import TextInput from 'shared/TextInput';
import IconTitleSet from 'shared/IconTitleSet';
import Wrapper from 'screens/Wrapper';

import firebase from 'lib/firebase';
import validateForm from 'helpers/validation';
import { getGravatarSrc } from 'helpers';


export default class Register extends Component {
  state = {
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
    isLoading: false,
  };

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
      .then(({ user }) => {
        // Add the new user to the users table
        firebase.database().ref()
          .child('users')
          .push({
            email: this.state.email,
            uid: user.uid,
            name: this.state.name,
            photoURL: getGravatarSrc(this.state.email),
          });

        // Update the user's metadata on firebase
        user.updateProfile({
          displayName: this.state.name,
          photoURL: getGravatarSrc(this.state.email),
        });
        this.setState({ isLoading: false });
        return this.props.navigation.navigate('MainMenu');
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
      <Wrapper isLoading={this.state.isLoading}>
        <ScrollView behavior="padding" contentContainerStyle={styles.container}>
          <IconTitleSet
            iconName="user-circle-o"
            iconType="font-awesome"
            iconSize={100}
            iconColor="#bdede3"
            style={styles.iconTitleSet}
          >
            Join Chat-a-lot
          </IconTitleSet>
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
        </ScrollView>
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
});
