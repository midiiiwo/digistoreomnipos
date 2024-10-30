/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

const ButtonLargeBottom = ({
  children,
  width,
  handlePress,
  backgroundColor,
  extraStyle = {},
  textStyle = {},
  disabled = false,
  disabledColor,
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.main,
        {
          width,
          backgroundColor: disabled ? disabledColor : backgroundColor,
          height: 70,
        },
        extraStyle,
      ]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    backgroundColor: '#59C1BD',
    justifyContent: 'center',
    alignItems: 'center',
    // height: 70,
    width: '80%',
  },
  text: {
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 20,
  },
});

export default ButtonLargeBottom;
