/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import PrimaryButton from '../components/PrimaryButton';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// const DetailItem = ({ label, value, firstItem }) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         // paddingLeft: 22,
//         borderBottomWidth: 0.4,
//         borderBottomColor: '#ddd',
//         paddingVertical: 12,
//         borderTopColor: firstItem ? '#ddd' : '',
//         borderTopWidth: firstItem ? 0.4 : 0,
//       }}>
//       <Text
//         style={{
//           color: '#4B6587',
//           fontFamily: 'SFProDisplay-Regular',
//           fontSize: 16,
//           letterSpacing: 0.3,
//         }}>
//         {label}{' '}
//       </Text>
//       <Text
//         style={{
//           color: '#4B6587',
//           fontFamily: 'SFProDisplay-Regular',
//           fontSize: 16,
//           marginLeft: 'auto',
//           marginRight: 4,
//           letterSpacing: 0.3,
//         }}>
//         {value}
//       </Text>
//     </View>
//   );
// };

// const mapProviderToName = {
//   ADSL: 'Vodafone Broadband',
//   MTNBB: 'MTN Fibre Broadband',
//   SURF: 'Surfline Internet',
//   BUSY: 'Busy Internet',
//   DSTV: 'DSTV',
//   GOTV: 'GOTV',
//   KWESETV: 'Kwese TV',
//   BO: 'BOX OFFICE',
//   ECGP: 'ECG Postpaid',
//   ECG: 'ECG Prepaid',
//   MTNPP: 'MTN Postpaid',
//   VPP: 'Vodafone Postpaid',
//   GWCL: 'Ghana Water',
// };

const SellTicketStatus = ({ route }) => {
  const { payStatus, message } = route.params;
  console.log(payStatus);
  const navigation = useNavigation();
  return (
    <>
      <ScrollView style={styles.main}>
        <View style={{ height: '100%' }}>
          {payStatus && payStatus != 0 && (
            <View
              style={{
                paddingHorizontal: 18,
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
                  textAlign: 'center',
                }}>
                Transfer Failed
              </Text>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  color: '#30475e',
                  marginBottom: 26,
                  fontSize: 15.5,
                  textAlign: 'center',
                }}>
                {message}
              </Text>
              {/* <DetailItem
                label="Transaction ID"
                value={payStatus && payStatus.id}
                firstItem
              /> */}
            </View>
          )}
          {payStatus && payStatus == 0 && (
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
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Regular',
                    color: '#30475e',
                    marginBottom: 26,
                    fontSize: 15.5,
                    textAlign: 'center',
                    width: '80%',
                    marginTop: 16,
                  }}>
                  {message}
                </Text>
              </View>

              {/* <View style={{ marginTop: 22, paddingHorizontal: 22 }}>
                <DetailItem
                  label="Airtime Top-up"
                  value={`GHS ${amount}`}
                  firstItem
                />
                <DetailItem label="Recipient Number" value={number} />
                <DetailItem
                  label="Commission Earned"
                  value={`GHS ${payStatus.commission}`}
                />
                <DetailItem label="Transaction ID" value={payStatus.id} />
                <DetailItem
                  label="Reference ID"
                  value={payStatus.reference.slice(0, 15)}
                />
                <DetailItem label="Service Provider" value={bill} />
              </View> */}
            </View>
          )}
        </View>
      </ScrollView>
      <PrimaryButton
        handlePress={() => {
          navigation.navigate('Sell Ticket Events');
          // navigation.navigate('Sell Ticket Events');
        }}
        style={{
          borderRadius: 5,
          width: '92%',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 12,
        }}>
        Got it
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

export default SellTicketStatus;
