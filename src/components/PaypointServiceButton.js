/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';

const ServiceButton = ({
  Icon,
  service,
  backgroundColor,
  handlePress,
  extraStyles,
}) => {
  return (
    <Pressable style={[styles.main]} onPress={handlePress}>
      <View style={[styles.button, { backgroundColor }, extraStyles]}>
        <Icon height={34} width={34} />
      </View>
      <Text style={styles.serviceButtonText}>{service}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    marginVertical: 8,
    width: Dimensions.get('window').width * 0.17,
    marginHorizontal: Dimensions.get('window').width * 0.033,
  },
  button: {
    backgroundColor: '#f9f9f9',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  serviceButtonText: {
    fontFamily: 'ReadexPro-Medium',
    marginTop: -10,
    color: '#30475e',
    fontSize: 12.4,
    textAlign: 'center',
  },
});

export default ServiceButton;

