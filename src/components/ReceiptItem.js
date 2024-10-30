/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReceiptItem = ({ itemName, quantity, amount, $extras, $removables }) => {
  let extras;
  let removables;

  console.log('extrasssss', $extras);

  try {
    extras = JSON.parse($extras);
    removables = JSON.parse($removables);
  } catch (error) {}
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
          {Object.values(extras || {}).length > 0 && (
            <View>
              <Text
                style={[
                  styles.taxLabel,
                  {
                    overflow: 'hidden',
                    // backgroundColor: 'red',
                    paddingHorizontal: 0,
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                    fontWeight: '800',
                    marginVertical: 4,
                  },
                ]}>
                Extras
              </Text>
              <Text
                style={[
                  styles.taxLabel,
                  {
                    overflow: 'hidden',
                    // backgroundColor: 'red',
                    paddingHorizontal: 0,
                  },
                ]}>
                {Object.values(extras)
                  .map(extra => {
                    if (extra) {
                      return extra?.order_extra;
                    }
                  })
                  .toString()}
              </Text>
            </View>
          )}
          {Object.values(removables || {}).length > 0 && (
            <View>
              <Text
                style={[
                  styles.taxLabel,
                  {
                    overflow: 'hidden',
                    // backgroundColor: 'red',
                    paddingHorizontal: 0,
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                    fontWeight: '800',
                    marginVertical: 4,
                  },
                ]}>
                Removables
              </Text>
              <Text
                style={[
                  styles.taxLabel,
                  {
                    overflow: 'hidden',
                    // backgroundColor: 'red',
                    paddingHorizontal: 0,
                  },
                ]}>
                {Object.values(removables)
                  .map(removable => {
                    if (removable) {
                      return removable?.order_removable;
                    }
                  })
                  .toString()}
              </Text>
            </View>
          )}
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
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  taxLabel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14.6,
    color: '#5C6E91',
    letterSpacing: 0.15,
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
    fontFamily: 'ReadexPro-Medium',
    fontWeight: '600',
    fontSize: 14.5,
    color: '#30475E',
    width: '70%',
    letterSpacing: 0.3,
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
    fontFamily: 'ReadexPro-Medium',
    fontSize: 14.4,
  },
});

export default ReceiptItem;
