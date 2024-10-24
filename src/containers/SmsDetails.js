/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';

function SmsDetails(props) {
  console.log('-----', props?.route?.params?.item);
  const {
    transaction_date,
    batch_no,
    bill_recipient,
    transaction_charge,
    transaction_status,
    bill_message,
  } = props?.route?.params?.item;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.main}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>
            SMS COST - GHS{transaction_charge}
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
                        transaction_status === 'Completed'
                          ? '#22A699'
                          : transaction_status === 'Pending'
                          ? '#FFB84C'
                          : '#D61355',
                    },
                  ]}
                />
                <Text style={styles.orderStatus}>{transaction_status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Transaction Date</Text>
            <Text style={styles.taxAmount}>{transaction_date}</Text>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Transaction ID</Text>
            <Text style={styles.taxAmount}>{batch_no}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Amount</Text>
            <Text style={styles.taxAmount}>
              GHS {Number(transaction_charge).toFixed(2)}
            </Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Recipient</Text>
            <Text style={styles.taxAmount}>{bill_recipient}</Text>
          </View>
          <Text
            style={[
              styles.taxAmount,
              {
                marginLeft: 0,
                color: '#694F8E',
                textDecorationLine: 'underline',
                marginTop: 14,
              },
            ]}>
            Sms Message
          </Text>
          <View style={styles.inputWrapper}>
            <Text style={[styles.input]} textAlignVertical="top">
              {bill_message}
            </Text>
          </View>
        </View>
      </ScrollView>
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
  input: {
    height: '40%',
    padding: 18,
    color: '#30475e',
    marginTop: 12,
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    borderBottomColor: '#068FFF',
    borderBottomWidth: 1.5,
    borderTopColor: '#ddd',
    borderTopWidth: 0.8,
    borderLeftColor: '#ddd',
    borderLeftWidth: 0.8,
    borderRightColor: '#ddd',
    borderRightWidth: 0.8,
    letterSpacing: 0.3,
  },
});

export default SmsDetails;
