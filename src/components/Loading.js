import React from 'react';
import { StyleSheet, View } from 'react-native';
import Lottie from 'lottie-react-native';

const Loading = () => {
  return (
    <View style={styles.main}>
      <Lottie
        source={require('../lottie/95136-2-parallel-lines-animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 150,  // Adjust the width as needed
    height: 150, // Adjust the height as needed
  },
});

export default Loading;
