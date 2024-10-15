/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAddMoneyStatus } from '../hooks/useAddMoneyStatus';
import LoadingModal from '../components/LoadingModal';
import { DetailItem } from './SendMoneyStatus';

const AddMoneyStatus = ({ route, navigation }) => {
  const { transferStatus } = route.params;
  const [checkStatus, setCheckStatus] = React.useState(false);
  const { data, isLoading } = useAddMoneyStatus(
    transferStatus.id,
    checkStatus && (data === null || data === undefined),
  );
  return (
    <View style={styles.main}>
      <View style={styles.messageWrapper}>
        <View style={styles.invoiceWrapper}>
          <Text style={styles.header}>Transaction Status</Text>
        </View>
        {isLoading ||
          (data && data.data && data.data.message === 'pending' && (
            <LoadingModal />
          ))}
        {!isLoading && data && data.data && data.data.message === 'paid' && (
          <View style={{ alignItems: 'center' }}>
            <Lottie
              source={require('../lottie/payment-success.json')}
              autoPlay
              autoSize
              loop={false}
              style={styles.lottie}
            />
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 15,
                color: '#30475e',
                textAlign: 'center',
                paddingHorizontal: 14,
              }}>
              {data && data.data && data.data.details}
            </Text>
            <View style={{ marginTop: 12 }}>
              <DetailItem
                label="Funds Added"
                value={`GHS ${data && data.data && data.data.amount}`}
              />
              <DetailItem
                label="Previous Balance"
                value={`GHS ${(
                  Number(data && data.data && data.data.balance) -
                  Number(data && data.data && data.data.amount)
                ).toFixed(2)}`}
              />
              <DetailItem
                label="New Balance"
                value={`GHS ${data && data.data && data.data.balance}`}
              />
              <DetailItem
                label="Transaction ID"
                value={data && data.data && data.data.id}
              />
            </View>
          </View>
        )}
        {!isLoading &&
          data &&
          data.data &&
          (data.data.message === 'failed' ||
            data.data.message === 'cancelled' ||
            data.data.message === 'expired') && (
            <Lottie
              source={require('../lottie/116089-payment-failed.json')}
              autoPlay
              autoSize
              loop={false}
              style={styles.lottie}
            />
          )}
        {!data && (
          <Text style={styles.message}>
            {transferStatus.message.replace(/<br>/g, ' ')}{' '}
            <Text
              style={[
                styles.message,
                { fontFamily: 'Inter-SemiBold', fontSize: 16 },
              ]}>
              Press the confirm button to verify payment
            </Text>
          </Text>
        )}
      </View>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={styles.btn}
          handlePress={() => {
            if (data && data.data) {
              navigation.navigate('Add Money');
              return;
            }
            setCheckStatus(true);
          }}
          disabled={isLoading}>
          {isLoading || (data && data.data && data.data.message === 'pending')
            ? 'Processing'
            : data && data.data && data.data.status == 0
            ? 'Close'
            : 'Confirm'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default AddMoneyStatus;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#30475e',
    textAlign: 'center',
    width: '90%',
  },
  header: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#30475e',
  },
  messageWrapper: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  invoiceWrapper: {
    paddingVertical: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 14,
  },
  btnWrapper: {
    paddingHorizontal: 22,
    marginTop: 28,
  },
  btn: {
    borderRadius: 5,
  },
  lottie: {
    padding: 0,
    height: 180,
  },
});
