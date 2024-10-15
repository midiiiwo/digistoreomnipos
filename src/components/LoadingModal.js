import React from 'react';
import { StyleSheet, View } from 'react-native';
import Lottie from 'lottie-react-native';

const LoadingModal = () => {
  return (
    <View style={styles.main}>
      <Lottie
        source={require('../lottie/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 120,
    alignItems: 'center',
  },
  lottie: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingModal;
