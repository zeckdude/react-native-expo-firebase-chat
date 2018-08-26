import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const IconTitleSet = ({
  children, style, iconName, iconSize = 100, iconColor = '#bdede3', iconType, titleStyle,
}) => (
  <View style={[styles.container, style]}>
    <Icon
      name={iconName}
      size={iconSize}
      color={iconColor}
      type={iconType}
    />
    <Text style={[styles.title, titleStyle]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 25,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default IconTitleSet;
