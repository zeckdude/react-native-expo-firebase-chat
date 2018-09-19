import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import { showMessage } from 'react-native-flash-message';
import Button from 'shared/Button';
import TextInput from 'shared/TextInput';
import IconTitleSet from 'shared/IconTitleSet';
import validateForm from 'helpers/validation';
import Wrapper from 'screens/Wrapper';
import { get } from 'lodash';
import firebase from 'lib/firebase';
import { signInApp } from '../../auth';

export default class Login extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '',
    password: '',
    isLoading: false,
  };

  componentDidMount() {
    const messageProps = get(this.props, 'navigation.state.params.messageProps');
    if (messageProps) {
      const { title, body, type } = messageProps;

      showMessage({
        message: title,
        description: body,
        type,
      });
    }
  }

  runValidation = () => {
    const { email, password } = this.state;

    const fields = [
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
        ],
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

  onLoginPress = () => {
    const { email, password } = this.state;

    const isFormValid = this.runValidation();
    if (!isFormValid) {
      return;
    }

    this.setState({ isLoading: true });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ isLoading: false });
        signInApp().then(() => this.props.navigation.navigate('SignedInStack'));
      })
      .catch((error) => {
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
      <Wrapper isLoading={this.state.isLoading}>
        <StatusBar barStyle="light-content" backgroundColor="#16a085" />
        <View style={styles.container}>
          <IconTitleSet
            iconName="chat"
            iconSize={100}
            iconColor="#bdede3"
            style={styles.iconTitleSet}
          >
            Chat-a-lot
          </IconTitleSet>
          <KeyboardAvoidingView style={styles.loginformContainer}>
            <TextInput
              placeholder="Email Address"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            <TextInput
              placeholder="Password"
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
          <Button onPress={() => this.props.navigation.navigate('ResetPassword')}>Reset Password</Button>
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  iconTitleSet: {
    marginBottom: 20,
  },
  loginformContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  signUpButton: {
    marginBottom: 10,
  },
});
