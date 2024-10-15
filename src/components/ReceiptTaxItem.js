/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReceiptTaxItem = ({ taxName, amount, taxType, showSymbol = true }) => {
  return (
    <View style={[styles.main]}>
      <View style={styles.auxWrapper}>
        <View>
          <View style={styles.upper}>
            <Text style={styles.itemName}>
              {taxName}{' '}
              <Text
                style={{
                  textTransform: 'capitalize',
                  fontSize: 15,
                  color: '#9DB2BF',
                }}>
                {taxType === 'INCLUSIVE'
                  ? '(Incl.)'
                  : taxType === '' || !taxType
                  ? ''
                  : '(Excl.)'}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.amountWrapper}>
          <Text style={styles.amount}>
            {showSymbol ? 'GHS' : ' '}{' '}
            {new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(amount))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 10,
    // borderTopColor: 'rgba(146, 169, 189, 0.5)',
    // borderTopWidth: 0.4,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    // flex: 1,
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
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15.5,
    color: '#30475E',
  },
  amountWrapper: {
    marginLeft: 'auto',
    maxWidth: '50%',
    textAlign: 'left',
  },
  amount: {
    color: '#1942D8',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14.4,
  },
});

export default ReceiptTaxItem;
