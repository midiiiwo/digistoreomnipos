/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';

const ServiceButton = ({
  Icon,
  service,
  color,
  backgroundColor,
  handlePress,
  extraStyles,
  copilot,
}) => {
  return (
    <Pressable
      style={[styles.main, { backgroundColor, borderRadius: 6 }]}
      onPress={handlePress}>
      <View style={[styles.button, extraStyles]}>
        <Icon height={36} width={36} stroke="#000000" />
      </View>
      <Text style={styles.serviceButtonText}>{service}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    // alignItems: 'center',
    width: Dimensions.get('window').width * 0.18,
    marginRight: 8,
    // backgroundColor: 'red',
    paddingVertical: 18,
    paddingLeft: 20,
  },

  serviceButtonText: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475e',
    fontSize: 15.5,
    marginTop: Dimensions.get('window').height * 0.07,
    letterSpacing: 0.3,
  },
});

export default ServiceButton;
