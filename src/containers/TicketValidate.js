/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

import Scanner from '../../assets/icons/scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from './api';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from 'react-query';

const TicketValidate = () => {
  const [voucher, setVoucher] = React.useState('');
  const navigation = useNavigation();
  const client = useQueryClient();
  const [redeemStatus, setRedeemStatus] = React.useState(null);
  const [btnText, setBtnText] = React.useState('Validate');
  // console.log('app global: ', appGlobal);
  const redeem = async v => {
    setBtnText('Loading');
    const user = await AsyncStorage.getItem('user');
    const user_ = JSON.parse(user || '');
    let response;
    try {
      response = await Api.put('tickets/validate/ticket', {
        serial_code: v,
        pin: '',
        merchant: user_.user_merchant_id,
        mod_by: user_.login,
      });
    } catch (error) {
      console.log(error);
    }
    setBtnText('Validate');
    return response;
  };

  React.useEffect(() => {
    if (redeemStatus) {
      client.invalidateQueries('ticket-history');
      navigation.navigate('Status', { redeemStatus });
      setRedeemStatus(null);
    }
  }, [redeemStatus, navigation, client]);

  return (
    <View style={styles.main}>
      <View style={styles.wrapper}>
        <Pressable
          style={styles.scannerWrapper}
          onPress={() => {
            navigation.navigate('Qr');
          }}>
          <Scanner height={42} width={42} />
          <Text style={styles.scanText}>Scan to validate</Text>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 28,
            marginTop: 12,
          }}>
          <View
            style={{
              borderBottomColor: '#ddd',
              borderBottomWidth: 0.4,
              width: 140,
            }}
          />
          <Text
            style={{
              marginHorizontal: 16,
              fontFamily: 'SFProDisplay-Regular',
              color: '#ccc',
              fontSize: 16,
            }}>
            or
          </Text>
          <View
            style={{
              borderBottomColor: '#ddd',
              borderBottomWidth: 0.4,
              width: 140,
            }}
          />
        </View>
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Ticket Number"
              placeholderTextColor="#B8BEC4"
              cursorColor="#82AAE3"
              value={voucher}
              onChangeText={setVoucher}
              keyboardType="number-pad"
            />
          </View>
          {/* <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#B8BEC4"
              cursorColor="#82AAE3"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numbers-and-punctuation"
            />
          </View> */}
          <Pressable
            onPress={async () => {
              // console.log('therererere');
              const { data } = await redeem(voucher);
              if (data && data.code == 200) {
                setRedeemStatus(data);
              } else {
                setRedeemStatus(data);
              }
            }}
            style={[
              styles.btn,
              {
                backgroundColor:
                  voucher.length === 0 || btnText === 'Loading'
                    ? 'rgba(33, 146, 255, 0.5)'
                    : 'rgba(33, 146, 255, 1)',
              },
            ]}
            disabled={voucher.length === 0 || btnText === 'Loading'}>
            <Text style={styles.signin}>{btnText}</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              setBtnText('Validate');
              setRedeemStatus(null);
              setVoucher('');
            }}
            style={[
              styles.btn,
              {
                backgroundColor: '#fff',
              },
            ]}
            disabled={voucher.length === 0}>
            <Text style={[styles.signin, { color: '#2192FF' }]}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  icon: {
    marginHorizontal: 12,
  },

  wrapper: {
    backgroundColor: '#fff',
    height: '85%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopEndRadius: 24,
    borderTopLeftRadius: 24,
  },
  form: {
    paddingHorizontal: 30,
    // paddingTop: 50,
  },
  scannerWrapper: {
    paddingHorizontal: 46,
    paddingTop: 0,
    alignItems: 'center',
  },
  scanText: {
    fontFamily: 'ReadexPro-Regular',
    marginTop: 10,
    fontSize: 16,
    color: '#2192FF',
  },
  input: {
    height: '100%',
    borderRadius: 8,
    paddingHorizontal: 18,
    fontSize: 16,
    flex: 1,
    color: '#30475e',
    fontFamily: 'ReadexPro-Regular',
  },
  inputWrapper: {
    backgroundColor: '#F5F7F9',
    height: 58,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  btn: {
    backgroundColor: '#2192FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 10,
  },
  signin: {
    color: '#fff',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 16,
  },
});

export default TicketValidate;
