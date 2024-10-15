/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, StyleSheet, View, Text, ScrollView } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useGetSelectedOrderDetails } from '../../hooks/useGetSelectedOrderDetails';
import Loading from '../Loading';
import PrimaryButton from '../PrimaryButton';

const airtime = ['MTN', 'GLO', 'TIGO', 'VODAFONE', 'AIRTEL'];
const bills = [
  'DSTV',
  'BO',
  'GOTV',
  'ECGP',
  'ECG',
  'KWESETV',
  'MTNPP',
  'VPP',
  'GWCL',
  'SURF',
  'ADSL',
  'MTNBB',
  'BUSY',
];

const sendMoney = ['MTNMM', 'TIGOC', 'VODAC', 'AIRTLM', 'BANK'];

function PaypointTransactions(props) {
  const {
    TRANSACTION_DATE,
    TRANSACTION_ID,
    AMOUNT,
    COMMISSION,
    ACCOUNT,
    RECIPIENT,
    STATUS,
    REFERENCE,
    SOURCE,
    CHANNEL,
    CUSTOMER_NAME,
  } = props.payload.item;

  console.log(props.payload);

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={[styles.containerStyle]}
      indicatorStyle={styles.indicatorStyle}
      springOffset={0}
      defaultOverlayOpacity={0.3}>
      <ScrollView style={styles.main}>
        <View style={styles.header}>
          <Pressable onPress={() => SheetManager.hide('transaction')}>
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>
            TRANSACTION HISTORY - {props.payload.name.toUpperCase()}
          </Text>
          <View style={styles.status}>
            <View style={[styles.statusWrapper]}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      STATUS === 'Completed' ? '#87C4C9' : '#FD8A8A',
                  },
                ]}
              />
              <Text style={styles.orderStatus}>{STATUS}</Text>
            </View>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Transaction Date</Text>
            <Text style={styles.taxAmount}>{TRANSACTION_DATE}</Text>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Transaction ID</Text>
            <Text style={styles.taxAmount}>{TRANSACTION_ID}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Amount</Text>
            <Text style={styles.taxAmount}>
              GHS {Number(AMOUNT).toFixed(2)}
            </Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Commission</Text>
            <Text style={styles.taxAmount}>GHS {COMMISSION}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Account</Text>
            <Text style={styles.taxAmount}>{ACCOUNT}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Recipient</Text>
            <Text style={styles.taxAmount}>{CUSTOMER_NAME}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Reference</Text>
            <Text style={[styles.taxAmount]}>
              {(REFERENCE && REFERENCE.slice(0, 20)) || ''}
            </Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Source</Text>
            <Text style={styles.taxAmount}>{SOURCE}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 12 }}>
        {STATUS === 'Completed' && (
          <PrimaryButton
            style={{ borderRadius: 4 }}
            handlePress={() => {
              SheetManager.hide('transaction');
              if (airtime.includes(CHANNEL)) {
                props.payload.navigation.navigate('Airtime Receipt', {
                  recipientNumber: RECIPIENT,
                  amount: AMOUNT,
                  transactionId: TRANSACTION_ID,
                  referenceId: REFERENCE,
                  serviceProvider: props.payload.name,
                });
                return;
              }
              if (bills.includes(CHANNEL)) {
                props.payload.navigation.navigate('Bill Receipt', {
                  accountNumber: RECIPIENT,
                  mobileNumber: RECIPIENT,
                  amount: AMOUNT,
                  transactionId: TRANSACTION_ID,
                  referenceId: REFERENCE,
                  billName: props.payload.name,
                  commission: COMMISSION,
                  accountName: '',
                });
                return;
              }
              if (sendMoney.includes(CHANNEL)) {
                props.payload.navigation.navigate('Send Money Receipt', {
                  accountNumber: RECIPIENT,
                  recipientNumber: RECIPIENT,
                  amount: AMOUNT,
                  invoiceId: TRANSACTION_ID,
                  referenceId: REFERENCE,
                  serviceProvider: props.payload.name,
                  commission: COMMISSION,
                  description: '',
                });
                return;
              }
            }}>
            Transaction Receipt
          </PrimaryButton>
        )}
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28,
    height: '100%',
  },
  indicatorStyle: {
    display: 'none',
  },
  done: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
    marginLeft: 'auto',
  },
  header: {
    paddingHorizontal: 4,
    marginBottom: 7,
  },
  orderNo: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#30475E',
  },
  orderStatus: {
    fontFamily: 'Inter-Medium',
    color: '#30475e',
    fontSize: 15,
  },
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor: '#87C4C9',
  },

  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingRight: 18,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  changeWrapper: {
    marginLeft: 'auto',
    marginRight: 14,
  },
  change: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    paddingBottom: 12,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    color: '#5C6E91',
    fontSize: 14,
    marginTop: 5,
  },
  summary: {
    marginVertical: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
    color: '#30475e',
    fontSize: 14,
  },
  taxMain: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    justifyContent: 'center',
  },
  taxLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#5C6E91',
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#5C6E91',
    maxWidth: '60%',
  },
});

export default PaypointTransactions;
