/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Pressable } from 'react-native';
import { View, StyleSheet } from 'react-native';
import Tick from '../../assets/icons/tick.svg';
import InActiveTick from '../../assets/icons/tick-circle.svg';
import { useRadioButton } from '../hooks/useRadioButton';
import { useSelector } from 'react-redux';

const RadioButton = ({ color, children, idx }) => {
  const radio = useRadioButton();
  const { customer } = useSelector(state => state.sale);

  const isActive = radio.idx === idx;

  // if(idx === 0 && !customer) {
  //   return (
  //     <Pressable></Pressable>
  //   )
  // }

  return (
    <Pressable
      disabled={idx === 0 && !customer}
      style={styles.main}
      onPress={() => radio.changeIdx(idx)}>
      {isActive && <Tick stroke={color} height={24} width={24} />}
      {!isActive && <InActiveTick stroke={color} height={24} width={24} />}
      <View style={styles.childWrapper}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 14,
    alignItems: 'center',
    // flex: 1,
  },
  mainBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    marginRight: 20,
  },
  childWrapper: {
    width: '100%',
    marginLeft: 12,
  },
});

export default RadioButton;

