/* eslint-disable prettier/prettier */
import React from 'react';
import { Pressable, StyleSheet, Dimensions } from 'react-native';

import AddIcon from '../../assets/icons/add.svg';

const AddProductCard = ({ handlePress, height, width }) => {
  return (
    <Pressable onPress={handlePress} style={[styles.main, { height, width }]}>
      <AddIcon height={72} width={72} stroke="rgba(96, 126, 170, 0.8)" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(96, 126, 170, 0.08)',
    margin: Dimensions.get('window').width * 0.02,
  },
  text: {
    fontSize: 18,
    fontFamily: 'SourceSansPro-Bold',
  },
});

export default AddProductCard;
