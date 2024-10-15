/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { DetailItem } from './SendMoneyStatus';
import PrimaryButton from '../components/PrimaryButton';

const TransferMoneyStatus = ({ route, navigation }) => {
  const { transferStatus } = route.params;
  const { data } = transferStatus;
  return (
    <View style={styles.main}>
      <View style={{ alignItems: 'center', marginTop: 58 }}>
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 15,
            color: '#30475e',
            textAlign: 'center',
            width: '85%',
          }}>
          {transferStatus &&
            transferStatus.message &&
            transferStatus.message
              .replace(/<br>/g, '')
              .replace(/<b>/g, '')
              .replace(/<\/br>/g, '')
              .replace(/<\/b>/g, '')}
        </Text>
        <View style={{ marginTop: 12, paddingHorizontal: 14 }}>
          <DetailItem
            label="Beneficiary Name"
            value={data[0].beneficiary_name}
          />
          <DetailItem label="Amount" value={`GHS ${data[0].payment_amount}`} />
          <DetailItem label="Reference" value={data[0].transaction_ref} />
          <DetailItem label="Invoice" value={data[0].invoice_number} />
          <DetailItem
            label="Beneficiary contact"
            value={data[0].beneficiary_phone}
          />
          <DetailItem label="Date due" value={data[0].payment_due_date} />
          <DetailItem label="Payout type" value={data[0].payout_type} />
        </View>
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            navigation.navigate('Transfer Funds', {
              pending: data,
              batchNo: transferStatus.id,
            });
          }}>
          Got it
        </PrimaryButton>
      </View>
    </View>
  );
};

export default TransferMoneyStatus;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
});
