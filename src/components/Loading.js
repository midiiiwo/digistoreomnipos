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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Loading;
