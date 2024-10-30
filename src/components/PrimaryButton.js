/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, Pressable, Platform } from 'react-native';

const PrimaryButton = ({ children, width, handlePress, style, disabled }) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.main,
        {
          width,
          marginBottom: Platform.OS === 'android' ? -3 : 7,
          backgroundColor: style.backgroundColor
            ? style.backgroundColor
            : disabled
            ? 'rgba(25, 66, 216, 0.9)'
            : 'rgba(25, 66, 216, 0.9)',
        },
        style,
      ]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    // backgroundColor: 'rgba(25, 66, 216, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    width: '80%',
  },
  text: {
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 14.9,
    letterSpacing: 0.3,
  },
});

export default PrimaryButton;
