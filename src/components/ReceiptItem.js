import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Dot from '../../assets/icons/dot.svg';

const ReceiptItem = ({ itemName, quantity, amount }) => {
  return (
    <View style={[styles.main]}>
      <View style={styles.auxWrapper}>
        <View>
          <View style={styles.upper}>
            <Text style={styles.quant}>x{quantity}</Text>
            {/* <Dot style={styles.dot} /> */}
            <Text style={styles.itemName} numberOfLines={1}>
              {itemName}
            </Text>
          </View>
          {/* <Text style={styles.variant}>{variant}kg</Text> */}
        </View>
        <View style={styles.amountWrapper}>
          <Text style={styles.amount}>GHS {amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  auxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 6,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
    fontSize: 16,
    color: '#30475E',
    width: '70%',
  },
  quant: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 14,
    color: 'rgba(48, 71, 94, 0.6)',
    marginRight: 6,
    marginTop: 3,
  },
  variant: {
    fontFamily: 'JetBrainsMono-Regular',
    // marginTop: 4,
    fontSize: 16,
  },
  amountWrapper: {
    marginLeft: 'auto',
  },
  amount: {
    color: '#1942D8',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});

export default ReceiptItem;
