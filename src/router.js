import React from 'react';
import { Button } from 'react-native';
import {
  StackNavigator,
  SwitchNavigator,
} from 'react-navigation';

import api from 'api';
import { showMessage } from 'react-native-flash-message';

import Login from './components/screens/Login';
import MainMenu from './components/screens/MainMenu';
import UserList from './components/screens/UserList';
import Chat from './components/screens/Chat';
import GlobalChat from './components/screens/GlobalChat';
import ResetPassword from './components/screens/ResetPassword';
import Register from './components/screens/Register';
import { signOutApp } from './auth';

// Authorization flow created with help from:
// https://medium.com/the-react-native-log/building-an-authentication-flow-with-react-navigation-fb5de2203b5c

export const SignedOutStack = StackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        title: 'Login',
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        title: 'Join',
      },
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        title: 'Reset Password',
      },
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: null,
      },
      headerTintColor: '#16a085',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
  },
);

export const SignedInStack = StackNavigator(
  {
    MainMenu: {
      screen: MainMenu,
      navigationOptions: {
        title: 'Main Menu',
      },
    },
    GlobalChat: {
      screen: GlobalChat,
      navigationOptions: {
        title: 'Global Chat',
      },
    },
    UserList: {
      screen: UserList,
      navigationOptions: {
        title: 'User List',
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        title: 'Chat',
      },
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: null,
        paddingLeft: 10,
        paddingRight: 10,
      },
      headerTintColor: '#16a085',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (
        <Button
          primary
          title="Logout"
          color="#16a085"
          onPress={() => {
            api.signOutFirebase()
              .then(
                () => {
                  signOutApp().then(() => navigation.navigate('SignedOutStack', {
                    messageProps: {
                      title: 'Bye-Bye',
                      body: 'Talk to you later!',
                      type: 'warning',
                    },
                  }));
                },
                (error) => {
                  showMessage({
                    message: 'Uh-oh',
                    description: `${error.message} (${error.code})`,
                    type: 'danger',
                  });
                },
              );
          }}
        >
          Log out
        </Button>
      ),
    }),
  },
);

export const createRootNavigator = (signedIn = false) => SwitchNavigator(
  {
    SignedInStack: {
      screen: SignedInStack,
    },
    SignedOutStack: {
      screen: SignedOutStack,
    },
  },
  {
    initialRouteName: signedIn ? 'SignedInStack' : 'SignedOutStack',
  },
);
