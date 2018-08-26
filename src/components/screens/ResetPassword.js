import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

import Button from 'shared/Button';
import TextInput from 'shared/TextInput';
import IconTitleSet from 'shared/IconTitleSet';
import Wrapper from 'screens/Wrapper';

import api from 'api';
import validateForm from 'helpers/validation';

export default class ResetPassword extends Component {
  state = {
    email: '',
    isLoading: false,
  };

  runValidation = () => {
    const { email } = this.state;

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

  sendPasswordResetEmail = () => {
    const { email } = this.state;

    const isFormValid = this.runValidation();
    if (!isFormValid) {
      return;
    }

    this.setState({ isLoading: true });

    api.sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ isLoading: false });
        this.props.navigation.navigate('Login', {
          messageProps: {
            title: 'Your mail is on its way',
            body: 'Check your inbox for your reset email',
            type: 'warning',
          },
        });
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
        <View style={styles.container}>
          <IconTitleSet
            iconName="mail"
            iconSize={100}
            iconColor="#bdede3"
            style={styles.iconTitleSet}
          >
            Send Reset Email
          </IconTitleSet>
          <TextInput
            placeholder="Email Address"
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <Button onPress={this.sendPasswordResetEmail}>RESET PASSWORD</Button>
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  iconTitleSet: {
    marginBottom: 20,
  },
});
