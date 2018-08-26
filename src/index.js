import React from 'react';
import { View, Text } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { createRootNavigator } from './router';
import { isSignedIn } from './auth';

// Don't show message that debugger will make app load slower
console.ignoredYellowBox = ['Remote debugger'];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false,
    };
  }

  componentDidMount() {
    isSignedIn()
      .then(response => this.setState({ signedIn: response, checkedSignIn: true }))
      .catch(err => alert('An error occurred'));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
      // return <View><Text>Loading in src/index.js</Text></View>;
    }

    const Layout = createRootNavigator(signedIn);
    // return <Layout />;
    return (
      <View style={{ flex: 1 }}>
        <Layout />
        {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
        <FlashMessage
          position="top"
          duration={5000}
        />
      </View>
    );
  }
}
