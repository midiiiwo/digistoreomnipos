/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { useActionCreator } from '../hooks/useActionCreator';

const PaymentCard = ({ path, payment, handlePress }) => {
  const { setPaymentChannel } = useActionCreator();
  return (
    <Pressable
      style={[styles.cardMain]}
      onPress={() => {
        setPaymentChannel(payment);
        handlePress();
      }}>
      <View style={styles.imgContainer}>
        {payment === 'MTNMM' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/mtn-momo.png')}
          />
        )}
        {payment === 'TIGOC' && (
          <Image
            style={[styles.img]}
            source={require('../../assets/images/AirtelTigo-Money.jpeg')}
          />
        )}
        {payment === 'VODAC' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/voda-cash.png')}
          />
        )}
        {payment === 'CASH' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/cash1.jpeg')}
          />
        )}
        {payment === 'QRPAY' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/qrnew.png')}
          />
        )}
        {payment === 'VISAG' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/credit-card.png')}
          />
        )}
        {payment === 'INVPAY' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/task.png')}
          />
        )}
        {payment === 'OFFMOMO' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/offline-momo.png')}
          />
        )}
        {payment === 'BANK' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/saving.png')}
          />
        )}
        {payment === 'OFFCARD' && (
          <Image
            style={styles.img}
            source={require('../../assets/images/no-wifi.png')}
          />
        )}
        {payment === 'DEBITBAL' && (
          <Image
            style={[styles.img, { borderRadius: 0 }]}
            source={require('../../assets/images/paylater.png')}
          />
        )}
        {payment === 'CREDITBAL' && (
          <Image
            style={[styles.img, { borderRadius: 0 }]}
            source={require('../../assets/images/storecredit.png')}
          />
        )}
        <Text style={styles.option}>
          {payment === 'INVPAY' ? 'Invoice' : path}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardMain: {
    marginBottom: Dimensions.get('window').height * 0.04,
    width: Dimensions.get('window').width * 0.18,
    // marginHorizontal: Dimensions.get('window').width * 0.0,
  },
  imgContainer: {
    alignItems: 'center',
  },
  option: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 15.5,
    color: '#30475E',
    fontFamily: 'ReadexPro-Medium',
  },
  img: {
    height: 70,
    width: 70,
    borderRadius: 118,
    // borderWidth: 0.8,
    // borderColor: '#ddd',
  },
});

export default PaymentCard;
