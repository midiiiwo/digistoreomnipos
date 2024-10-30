/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';

const ServiceButton = React.forwardRef(
  (
    {
      Icon,
      service,

      handlePress,
      extraStyles,
    },
    ref,
  ) => {
    return (
      <Pressable style={[styles.main, {}]} onPress={handlePress} ref={ref}>
        <View style={[styles.button, extraStyles]}>
          <Icon height={32} width={32} />
        </View>
        <Text style={styles.serviceButtonText}>{service}</Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.26,
    marginHorizontal: 10,
    // backgroundColor: 'red',
    paddingVertical: 12,
  },
  button: {
    // borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceButtonText: {
    fontFamily: 'ReadexPro-Medium',
    color: '#091D60',
    fontSize: 13.5,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ServiceButton;

