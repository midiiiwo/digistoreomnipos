/* eslint-disable react-native/no-inline-styles */
import { TextInput } from 'react-native-paper';
import React from 'react';
import { StyleSheet } from 'react-native';

const InvoiceInput = ({
  placeholder,
  val,
  setVal,
  nLines,
  showError,
  ...props
}) => {
  return (
    <TextInput
      // placeholder={placeholder}
      label={placeholder}
      textColor="#30475e"
      value={val}
      onChangeText={setVal}
      mode="outlined"
      outlineColor={showError ? '#EB455F' : '#E8EEFC'}
      activeOutlineColor={showError ? '#EB455F' : '#068FFF'}
      outlineStyle={{
        borderRadius: 4.5,
        borderWidth: 1.3,
      }}
      style={styles.input}
      contentStyle={styles.contentStyle}
      numberOfLines={nLines}
      multiline={nLines ? true : false}
      {...props}
      placeholderTextColor="#30475e"
    />
  );
};

export default InvoiceInput;

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    justifyContent: 'center',
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#30475e',
  },
  contentStyle: {
    fontFamily: 'ReadexPro-Regular',
    letterSpacing: 0,
    color: '#002',
    fontSize: 13.5,
  },
});
