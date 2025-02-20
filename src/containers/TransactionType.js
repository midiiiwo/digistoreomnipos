/* eslint-disable react-native/no-inline-styles */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import GiftCard from '../../assets/icons/voucher';
import Export from '../../assets/icons/export.svg';
import Import from '../../assets/icons/import.svg';
import Supplier from '../../assets/icons/Fees.svg';
import { Pressable } from 'react-native';

const TransactionType = ({ navigation }) => {
  return (
    <View style={styles.main}>
      {/* <CustomStatusBar backgroundColor="#fff" /> */}
      <ScrollView>
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-Medium',
              fontSize: 22,
              color: '#002',
            }}>
            Transactions
          </Text>
        </View>
        <Pressable
          style={[styles.item, { borderTopColor: '#ddd', borderTopWidth: 0.4 }]}
          onPress={() => {
            navigation.navigate('Inflows');
          }}>
          <Import height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Inflows</Text>
            <Text style={styles.caption}>
              Sales/Payments received from customers
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            navigation.navigate('Outflows');
          }}>
          <Export height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Outflows</Text>
            <Text style={styles.caption}>
              Payments/Purchases made from your account
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            // navigation.navigate('Outflows');
          }}>
          <Supplier height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Suppliers Purchases</Text>
            <Text style={styles.caption}>Payments/Purchases of suppliers</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            // navigation.navigate('Outflows');
          }}>
          <GiftCard height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Gift Cards & Vouchers</Text>
            <Text style={styles.caption}>
              Payments/Purchases made from your account
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default TransactionType;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 14,
    // paddingTop: 10,
  },
  itemHeader: {
    fontSize: 15,
    color: '#30475e',
    fontFamily: 'ReadexPro-Medium',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: '#ddd',
    paddingHorizontal: 22,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  caption: {
    fontSize: 13,
    color: '#748DA6',
    fontFamily: 'ReadexPro-Regular',
  },
  wrapper: {
    width: '85%',
    marginLeft: 13,
  },
});
