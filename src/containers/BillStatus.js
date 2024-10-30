/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import PrimaryButton from '../components/PrimaryButton';
import { ScrollView } from 'react-native-gesture-handler';

const DetailItem = ({ label, value, firstItem }) => {
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
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 16,
        }}>
        {label}{' '}
      </Text>
      <Text
        style={{
          color: '#4B6587',
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 16,
          marginLeft: 'auto',
          // marginRight: 12,
          width: '50%',
          textAlign: 'right',
        }}>
        {value}
      </Text>
    </View>
  );
};

const mapProviderToName = {
  ADSL: 'Vodafone Broadband',
  MTNBB: 'MTN Fibre Broadband',
  SURF: 'Surfline Internet',
  BUSY: 'Busy Internet',
  DSTV: 'DSTV',
  GOTV: 'GOTV',
  KWESETV: 'Kwese TV',
  BO: 'BOX OFFICE',
  ECGP: 'ECG Postpaid',
  ECG: 'ECG Prepaid',
  MTNPP: 'MTN Postpaid',
  VPP: 'Vodafone Postpaid',
  GWCL: 'Ghana Water',
  MTNMD: 'MTN Data Bundle',
  VODAMD: 'Telecel Data Bundle',
  TIGOMD: 'At Data Bundle',
};

const BillStatus = ({ route, navigation }) => {
  const { payStatus, name, accountNumber, bill, amount, mobileNumber } =
    route.params;
  console.log(payStatus);
  return (
    <>
      <ScrollView style={styles.main}>
        <View style={{ height: '100%' }}>
          {payStatus?.status != 0 && (
            <View
              style={{
                height: '100%',
                paddingHorizontal: 18,
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
                  fontFamily: 'SFProDisplay-Semibold',
                  color: '#EB455F',
                  marginBottom: 16,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Transfer Failed
              </Text>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  color: '#30475e',
                  marginBottom: 16,
                  fontSize: 15,
                  textAlign: 'center',
                  paddingHorizontal: 12,
                }}>
                {payStatus?.message}
              </Text>
              <DetailItem
                label="Transaction ID"
                value={payStatus && payStatus.id}
                firstItem
              />
              <DetailItem
                label="Reference"
                value={payStatus && payStatus.reference}
              />
            </View>
          )}
          {payStatus?.status == 0 && (
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
                    fontFamily: 'SFProDisplay-Regular',
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
                <DetailItem label="Account Name" value={name} />
                <DetailItem label="Account Number" value={accountNumber} />
                <DetailItem
                  label="Commission Earned"
                  value={`GHS ${payStatus?.commission}`}
                />
                <DetailItem label="Transaction ID" value={payStatus?.id} />
                <DetailItem label="Reference ID" value={payStatus?.reference} />
                <DetailItem
                  label="Service Provider"
                  value={mapProviderToName[bill]}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <PrimaryButton
        handlePress={() => {
          if (payStatus?.status == '0') {
            navigation.navigate('Bill Receipt', {
              accountName: name,
              accountNumber,
              billName: mapProviderToName[bill],
              transactionId: payStatus.id,
              referenceId: payStatus.reference,
              commission: payStatus.commission,
              amount,
              mobileNumber,
            });
          } else {
            navigation.navigate('Paypoint');
          }
        }}
        style={{
          borderRadius: 5,
          width: '92%',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 12,
        }}>
        {payStatus?.status == '0'
          ? 'Transaction receipt'
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

export default BillStatus;
