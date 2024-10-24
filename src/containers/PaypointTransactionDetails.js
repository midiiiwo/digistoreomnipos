/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { useCheckInvoiceStatus } from '../hooks/useCheckInvoiceStatus';

const airtime = ['MTN', 'GLO', 'TIGO', 'VODAFONE', 'AIRTEL'];

const bills = [
  'DSTV',
  'BO',
  'GOTV',
  'KWESETV',
  'SURF',
  'ADSL',
  'MTNBB',
  'BUSY',
  'ECGP',
  'ECG',
  'GWCL',
  'MTNPP',
  'VPP',
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
    CHANNEL,
    CUSTOMER_NAME,
    DESCRIPTION,
    SERVICE_FEE,
    MOD_BY,
  } = props?.route?.params?.payload?.item;

  const options = props?.route?.params?.payload?.options;

  const toast = useToast();

  // const {} = useCheck

  const { user } = useSelector(state => state.auth);

  const { mutate } = useCheckInvoiceStatus(i => {
    if (i) {
      toast.show(i?.message, { placement: 'top' });
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.main}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>
            TRANSACTION HISTORY -{' '}
            {props?.route?.params?.payload?.name?.toUpperCase()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 6,
            }}>
            <View style={{}}>
              <View style={[styles.statusWrapper]}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        STATUS === 'Completed'
                          ? '#22A699'
                          : STATUS === 'Pending'
                          ? '#FFB84C'
                          : '#D61355',
                    },
                  ]}
                />
                <Text style={styles.orderStatus}>{STATUS}</Text>
              </View>
            </View>
            <Pressable
              style={{ marginLeft: 'auto', paddingHorizontal: 4 }}
              onPress={() => {
                if (airtime.includes(CHANNEL)) {
                  const airtimePreviousData = {
                    recipientNumber: RECIPIENT,
                    amount: AMOUNT,
                    channel: CHANNEL,
                  };
                  props.navigation.navigate('Airtime', {
                    airtimePreviousData,
                    airtime: options && options.airtime,
                  });
                  // SheetManager.hide('transaction');
                  return;
                }
                if (bills.includes(CHANNEL)) {
                  props.navigation.navigate('Bill Details', {
                    bill: props?.route?.params?.payload?.name,
                    billCode: CHANNEL,
                    accountNumber: ACCOUNT,
                    amount: AMOUNT,
                  });
                  // SheetManager.hide('transaction');
                  return;
                }

                if (sendMoney.includes(CHANNEL)) {
                  const sendMoneyDetails = {
                    accountNumber: RECIPIENT,
                    recipientNumber: RECIPIENT,
                    amount: AMOUNT,
                    description: DESCRIPTION,
                    channel: CHANNEL,
                  };
                  props.navigation.navigate('Send Money', {
                    sendMoneyDetails,
                    bill: props?.route?.params?.payload?.name,
                    billCode: 'S' + CHANNEL,
                    lookup: 'S' + CHANNEL,
                  });
                  // SheetManager.hide('transaction');
                  return;
                }
              }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  fontSize: 14.5,
                  color: 'rgba(25, 66, 216, 0.9)',
                }}>
                Repeat Transaction
              </Text>
            </Pressable>
          </View>
          {sendMoney.includes(CHANNEL) && STATUS === 'Pending' && (
            <View style={styles.btnWrapper}>
              <PrimaryButton
                style={[styles.btn, { backgroundColor: '#30475e' }]}
                handlePress={() => {
                  toast.show('Checking transaction status', {
                    placement: 'top',
                  });
                  mutate({
                    merchant: user.merchant,
                    invoice: TRANSACTION_ID,
                    action: 'check_invoice_status',
                  });
                }}>
                Check Transaction Status
              </PrimaryButton>
            </View>
          )}
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
            <Text style={styles.taxLabel}>Service Fee</Text>
            <Text style={styles.taxAmount}>
              GHS {Number(SERVICE_FEE).toFixed(2)}
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
              {REFERENCE?.slice(0, 20) || ''}
            </Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Description</Text>
            <Text style={[styles.taxAmount]}>{DESCRIPTION}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Created By</Text>
            <Text style={[styles.taxAmount]}>{MOD_BY}</Text>
          </View>

          {/* <View style={styles.taxMain}>
              <Text style={styles.taxLabel}>Source</Text>
              <Text style={styles.taxAmount}>{SOURCE}</Text>
            </View> */}
        </View>
      </ScrollView>
      <View
        style={{ padding: 12, borderTopColor: '#ddd', borderTopWidth: 0.6 }}>
        {STATUS === 'Completed' && (
          <PrimaryButton
            style={{ borderRadius: 4 }}
            handlePress={() => {
              // SheetManager.hide('transaction');
              if (airtime.includes(CHANNEL)) {
                props?.route?.params?.payload?.navigation.navigate(
                  'Airtime Receipt',
                  {
                    recipientNumber: RECIPIENT,
                    amount: AMOUNT,
                    transactionId: TRANSACTION_ID,
                    referenceId: REFERENCE,
                    serviceProvider: props?.route?.params?.payload?.name,
                  },
                );
                return;
              }
              if (bills.includes(CHANNEL)) {
                props?.route?.params?.payload?.navigation.navigate(
                  'Bill Receipt',
                  {
                    accountNumber: RECIPIENT,
                    mobileNumber: RECIPIENT,
                    amount: AMOUNT,
                    transactionId: TRANSACTION_ID,
                    referenceId: REFERENCE,
                    billName: props?.route?.params?.payload?.name,
                    commission: COMMISSION,
                    accountName: '',
                  },
                );
                return;
              }
              if (sendMoney.includes(CHANNEL)) {
                props?.route?.params?.payload?.navigation.navigate(
                  'Send Money Receipt',
                  {
                    accountNumber: RECIPIENT,
                    recipientNumber: RECIPIENT,
                    amount: AMOUNT,
                    invoiceId: TRANSACTION_ID,
                    referenceId: REFERENCE,
                    serviceProvider: props?.route?.params?.payload?.name,
                    commission: COMMISSION,
                    description: '',
                    recipientName: CUSTOMER_NAME,
                  },
                );
                return;
              }
            }}>
            Transaction Receipt
          </PrimaryButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28,
    height: Platform.OS === 'ios' ? '80%' : '90%',
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
    fontFamily: 'ReadexPro-Medium',
    color: '#5C6E91',
    fontSize: 14,
    marginTop: 5,
  },
  summary: {
    marginVertical: 12,
  },
  summaryLabel: {
    fontFamily: 'ReadexPro-Medium',
    marginBottom: 24,
    color: '#30475e',
    fontSize: 14,
  },
  taxMain: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopColor: '#eee',
    borderTopWidth: 0.6,
    justifyContent: 'center',
  },
  taxLabel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    letterSpacing: 0.3,
    color: '#30475e',
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 15,
    letterSpacing: 0.3,
    color: '#30475e',
    maxWidth: '60%',
  },
  btnWrapper: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '100%',
  },
});

export default PaypointTransactions;
