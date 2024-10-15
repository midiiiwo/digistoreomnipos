import React from 'react';
import { StyleSheet, View } from 'react-native';
import Lottie from 'lottie-react-native';

const InventoryLoading = () => {
  return (
    <View style={styles.main}>
      <Lottie
        source={require('../lottie/95136-2-parallel-lines-animation.json')}
        autoPlay
        loop
        // autoSize
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
});

export default InventoryLoading;
