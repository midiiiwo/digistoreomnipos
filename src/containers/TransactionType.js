/* eslint-disable react-native/no-inline-styles */
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SalesIcon from '../../assets/icons/tag';
import PaymentsIcon from '../../assets/icons/empty-wallet.svg';

import SMS from '../../assets/icons/sms.svg';
import GiftCard from '../../assets/icons/voucher';
import Export from '../../assets/icons/export.svg';
import Import from '../../assets/icons/import.svg';
import Supplier from '../../assets/icons/Fees.svg';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import CustomStatusBar from '../components/StatusBar';

const TransactionType = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  return (
    <View style={styles.main}>
      {/* <CustomStatusBar backgroundColor="#fff" /> */}
      <ScrollView>
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Semibold',
              fontSize: 26,
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
          <Import height={35} width={35} />
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
          <Export height={35} width={35} />
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
          <Supplier height={35} width={35} />
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
          <GiftCard height={35} width={35} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Gift Cards & Vouchers</Text>
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
          <SMS height={35} width={35} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>SMS</Text>
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
    fontSize: 18,
    color: '#30475e',
    fontFamily: 'SFProDisplay-Semibold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: '#ddd',
    paddingHorizontal: 22,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  caption: {
    fontSize: 16,
    color: '#748DA6',
    fontFamily: 'SFProDisplay-Regular',
  },
  wrapper: {
    width: '85%',
    marginLeft: 13,
  },
});
