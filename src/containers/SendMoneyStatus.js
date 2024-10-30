/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import PrimaryButton from '../components/PrimaryButton';
import { ScrollView } from 'react-native-gesture-handler';

export const DetailItem = ({ label, value, firstItem }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        // paddingLeft: 22,
        borderBottomWidth: 0.4,
        borderBottomColor: '#ddd',
        paddingVertical: 12,
        borderTopColor: firstItem ? '#ddd' : '',
        borderTopWidth: firstItem ? 0.4 : 0,
      }}>
      <Text
        style={{
          color: '#4B6587',
          fontFamily: 'ReadexPro-Regular',
          fontSize: 16,
        }}>
        {label}{' '}
      </Text>
      <Text
        style={{
          color: '#4B6587',
          fontFamily: 'ReadexPro-Regular',
          fontSize: 16,
          marginLeft: 'auto',
          width: '60%',
          textAlign: 'right',
        }}>
        {value}
      </Text>
    </View>
  );
};

const mapProviderToName = {
  SMTNMM: 'MTN Mobile Money',
  SVODAC: 'Vodafone Cash',
  SARTLM: 'AirtelTigo Money',
  STIGOC: 'Tigo Cash',
};

const SendMoneyStatus = ({ route, navigation }) => {
  const { payStatus, serviceProvider, description, name, number, amount } =
    route.params;
  console.log(payStatus);
  return (
    <>
      <ScrollView style={styles.main}>
        <View style={{ height: '100%' }}>
          {payStatus && payStatus.status == 9999 && (
            <View
              style={{
                alignItems: 'center',
                height: '100%',
              }}>
              <View
                style={{
                  height: 140,
                  width: '100%',
                  top: 20,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <Lottie
                  source={require('../lottie/paymentLoading.json')}
                  autoPlay
                  loop={true}
                  style={{ marginBottom: 20 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#FFB84C',
                  marginBottom: 16,
                  fontSize: 16,
                }}>
                Transfer Pending
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#30475e',
                  marginBottom: 26,
                  fontSize: 15,
                  textAlign: 'center',
                  paddingHorizontal: 14,
                }}>
                {payStatus.message}
              </Text>
              <DetailItem
                label="Transaction ID"
                value={payStatus && payStatus.id}
                firstItem
              />
            </View>
          )}
          {payStatus && payStatus.status == 99 && (
            <View
              style={{
                alignItems: 'center',
                height: '100%',
              }}>
              <View
                style={{
                  height: 140,
                  width: '100%',
                  top: 20,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <Lottie
                  source={require('../lottie/94303-failed.json')}
                  autoPlay
                  loop={false}
                  style={{ marginBottom: 20 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#EB455F',
                  marginBottom: 16,
                  fontSize: 16,
                }}>
                Transfer Failed
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#30475e',
                  marginBottom: 26,
                  fontSize: 15,
                  textAlign: 'center',
                  paddingHorizontal: 14,
                }}>
                {payStatus.message}
              </Text>
              <DetailItem
                label="Transaction ID"
                value={payStatus && payStatus.id}
                firstItem
              />
            </View>
          )}
          {payStatus && payStatus.status == 93 && (
            <View
              style={{
                alignItems: 'center',
                height: '100%',
              }}>
              <View
                style={{
                  height: 140,
                  width: '100%',
                  top: 20,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <Lottie
                  source={require('../lottie/94303-failed.json')}
                  autoPlay
                  loop={false}
                  style={{ marginBottom: 20 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#EB455F',
                  marginBottom: 16,
                  fontSize: 16,
                }}>
                Transfer Failed
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  color: '#30475e',
                  marginBottom: 26,
                  fontSize: 15,
                  textAlign: 'center',
                  paddingHorizontal: 14,
                }}>
                {payStatus.message}
              </Text>
              <DetailItem
                label="Transaction ID"
                value={payStatus && payStatus.id}
                firstItem
              />
            </View>
          )}
          {payStatus && payStatus.status == 0 && (
            <View style={{ marginTop: 22 }}>
              <View
                style={{
                  height: 140,
                  width: '100%',
                  top: 2,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Lottie
                  source={require('../lottie/97240-success.json')}
                  autoPlay
                  loop={false}
                  style={{ position: 'absolute' }}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    color: '#59CE8F',
                    textAlign: 'center',
                    width: '80%',
                    fontSize: 18,
                  }}>
                  Successful
                </Text>
              </View>
              <View style={{ marginTop: 22, paddingHorizontal: 22 }}>
                <DetailItem
                  label="Amount Sent"
                  value={`GHS ${amount}`}
                  firstItem
                />
                <DetailItem label="Recipient Name" value={name} />
                <DetailItem label="Recipient Number" value={number} />
                <DetailItem label="Invoice ID" value={payStatus.id} />
                <DetailItem label="Reference ID" value={payStatus.reference} />
                <DetailItem label="Description" value={description} />
                <DetailItem
                  label="Service Provider"
                  value={mapProviderToName[serviceProvider]}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <PrimaryButton
        handlePress={() => {
          if (payStatus.status == '0') {
            navigation.navigate('Send Money Receipt', {
              amount,
              recipientName: name,
              recipientNumber: number,
              invoiceId: payStatus.id,
              referenceId: payStatus.reference,
              description,
              serviceProvider,
            });
          } else {
            navigation.navigate('Paypoint');
          }
        }}
        style={{
          borderRadius: 5,
          width: '92%',
          position: 'absolute',
          bottom: 12,
          alignSelf: 'center',
        }}>
        {payStatus.status == '0'
          ? 'Transaction Receipt'
          : 'Restart transaction'}
      </PrimaryButton>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default SendMoneyStatus;
