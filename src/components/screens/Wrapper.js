import React from 'react';
import { View } from 'react-native';
import FlashMessage from 'react-native-flash-message';

const Wrapper = ({ children }) => (
  <View style={{ flex: 1 }}>
    {children}
    <FlashMessage
      position="top"
      duration={5000}
    />
  </View>
);

export default Wrapper;
