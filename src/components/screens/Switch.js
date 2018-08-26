import React, { Component } from 'react';
import firebase from 'config/firebase';
import api from 'api';

import Login from './Login';
import MainMenu from './MainMenu';

export default class Switch extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      loading: true,
      authenticated: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loading: false, authenticated: true });
      } else {
        this.setState({ loading: false, authenticated: false });
      }
    });
  }

  render() {
    if (this.state.loading) return null; // Render loading/splash screen etc
    if (!this.state.authenticated) {
      return <Login navigation={this.props.navigation} />;
    }
    return <MainMenu navigation={this.props.navigation} />;
    // if (!this.state.authenticated) {
    //   return this.props.navigation.navigate('Login');
    // }
    // return this.props.navigation.navigate('MainMenu');
  }
}
