/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import BackSpace from '../../assets/icons/backspace.svg';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSelector } from 'react-redux';

const Keypad = () => {
  const { quickSaleAmount, setQuickSaleSubTotal } = useActionCreator();
  const { amount } = useSelector(state => state.quickSale);

  const handleKeyPress = React.useCallback(
    keyValue => {
      quickSaleAmount(keyValue);
      // updateSubTotalFromNumber(Number(keyValue));
    },
    [quickSaleAmount],
  );

  React.useEffect(() => {
    setQuickSaleSubTotal(Number(amount));
  }, [amount, setQuickSaleSubTotal]);

  return (
    <View style={styles.keypad}>
      <View style={styles.keypadRow}>
        <Pressable onPress={() => handleKeyPress('1')} style={styles.key}>
          <Text style={styles.keyVal}>1</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('2')}>
          <Text style={styles.keyVal}>2</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('3')}>
          <Text style={styles.keyVal}>3</Text>
        </Pressable>
      </View>
      <View style={styles.keypadRow} onPress={() => handleKeyPress('1')}>
        <Pressable style={styles.key} onPress={() => handleKeyPress('4')}>
          <Text style={styles.keyVal}>4</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('5')}>
          <Text style={styles.keyVal}>5</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('6')}>
          <Text style={styles.keyVal}>6</Text>
        </Pressable>
      </View>
      <View style={styles.keypadRow}>
        <Pressable style={styles.key} onPress={() => handleKeyPress('7')}>
          <Text style={styles.keyVal}>7</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('8')}>
          <Text style={styles.keyVal}>8</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('9')}>
          <Text style={styles.keyVal}>9</Text>
        </Pressable>
      </View>
      <View style={styles.keypadRow}>
        <Pressable style={styles.key} onPress={() => handleKeyPress('.')}>
          <Text style={styles.keyVal}>.</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={() => handleKeyPress('0')}>
          <Text style={styles.keyVal}>0</Text>
        </Pressable>
        <Pressable
          style={styles.key}
          onPress={() => quickSaleAmount('backspace')}>
          <BackSpace />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keypad: {
    width: '100%',
    // flex: 1,
    // height: Dimensions.get('window').height * 0.55,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    flex: 1,
    backgroundColor: '#fff',
  },
  keypadRow: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  key: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ddd',
    borderRightWidth: 0.5,
  },
  keyVal: {
    fontFamily: 'SQ Market Regular Regular',
    fontSize: 24,
    color: '#30475E',
    fontWeight: '100',
  },
});

export default React.memo(Keypad);

