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
        style={styles.animation}  // Adjust size in this style
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',      // Center horizontally
    backgroundColor: '#F1F5F9',
  },
  animation: {
    width: 150,  // Adjust the width as needed
    height: 150, // Adjust the height as needed
  },
});

export default InventoryLoading;
