/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';

const Button = ({
  children,
  backgroundColor,
  color,
  width,
  insetHeight,
  handlePress,
  height,
}) => {
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.main,
        {
          width,
          backgroundColor,
          paddingVertical: 20,
          height,
        },
      ]}>
      <Text style={[styles.text, { color }]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: '50%',
    // borderRadius: 4,
    // flex: 1,
  },
  text: {
    fontSize: 18,
    fontFamily: 'SourceSansPro-Bold',
  },
});

export default Button;
