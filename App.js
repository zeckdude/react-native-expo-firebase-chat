import React from 'react';
import { View } from 'react-native';

import { StackNavigator } from 'react-navigation';
import FlashMessage from 'react-native-flash-message';

import Switch from './src/components/screens/Switch';
import Login from './src/components/screens/Login';
import MainMenu from './src/components/screens/MainMenu';
import UserList from './src/components/screens/UserList';
import Chat from './src/components/screens/Chat';
import GlobalChat from './src/components/screens/GlobalChat';
import ResetPassword from './src/components/screens/ResetPassword';
import Register from './src/components/screens/Register';

const AppStack = StackNavigator(
  {
    Switch: {
      screen: Switch,
      navigationOptions: {
        title: 'Login',
      },
    },
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
    initialRouteName: 'Switch',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#16a085',
        elevation: null,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const App = () => (
  <View style={{ flex: 1 }}>
    <AppStack />
    {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
    <FlashMessage
      position="top"
      duration={5000}
    />
  </View>
);

export default App;
