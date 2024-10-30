/* eslint-disable react-native/no-inline-styles */
import { TextInput } from 'react-native-paper';
import React from 'react';
import { StyleSheet } from 'react-native';

const Input = ({ placeholder, val, setVal, nLines, showError, ...props }) => {
  return (
    <TextInput
      // placeholder={placeholder}
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : 'rgba(183, 196, 207,0.8)'}
      activeOutlineColor={showError ? '#EB455F' : '#068FFF'}
      outlineStyle={{
        borderRadius: 4.5,
      }}
      style={styles.input}
      contentStyle={styles.contentStyle}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
      placeholderTextColor="#ddd"
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    justifyContent: 'center',

    fontSize: 14.6,
    backgroundColor: '#fff',
  },
  contentStyle: {
    fontFamily: 'IBMPlexSans-Medium',
    color: '#30475e',
    fontSize: 14.8,
    letterSpacing: -0.15,
  },
});
