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
import ForgetPassword from './src/components/screens/ForgetPassword';
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
    ForgetPassword: {
      screen: ForgetPassword,
      navigationOptions: {
        title: 'ForgetPassword',
      },
    },
    MainMenu: {
      screen: MainMenu,
      navigationOptions: {
        title: 'MainMenu',
      },
    },
    GlobalChat: {
      screen: GlobalChat,
      navigationOptions: {
        title: 'GlobalChat',
      },
    },
    UserList: {
      screen: UserList,
      navigationOptions: {
        title: 'UserList',
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
