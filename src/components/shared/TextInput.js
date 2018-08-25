import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';

// This needs to be a class so that the refs that are potentially applied to this component will work
/* eslint react/prefer-stateless-function: 0 */
// https://stackoverflow.com/a/35900548/83916
class ChatTextInput extends Component {
  render() {
    const {
      placeholder = '',
      style,
      returnKeyType = 'next',
      onSubmitEditing,
      keyboardType = 'default',
      autoCapitalize = 'none',
      autoCorrect = false,
      value,
      onChangeText,
      secureTextEntry = false,
    } = this.props;
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#4f4e4e"
        style={[styles.input, style]}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#4f4e4e',
    paddingHorizontal: 10,
  },
});

export default ChatTextInput;
