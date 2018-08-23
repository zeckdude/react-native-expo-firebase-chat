import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import api from 'api';

export default class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      errorMessage: null,
      loading: false,
    };
  }

  onForgetPress = () => {
    this.setState({ errorMessage: null, loading: true });
    const { email } = this.state;
    api.sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.setState({
          errorMessage,
          loading: false,
        });
      });
  }

  renderErrorMessage = () => (
    this.state.errorMessage
      ? <Text style={styles.error}>{this.state.errorMessage}</Text>
      : null
  );

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16a085" />
        <TextInput
          placeholder="Username"
          placeholderTextColor="rgba(255,255,255,0.7)"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.onForgetPress}
        >
          <Text style={styles.buttonText}>Forget Password</Text>
        </TouchableOpacity>
        {this.renderErrorMessage()}
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    justifyContent: 'flex-start',
    backgroundColor: '#16a085',
    padding: 20,
    paddingTop: 100,
  },
  input: {
    height: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
  },
});
