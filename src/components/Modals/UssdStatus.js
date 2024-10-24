/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const UssdStatus = ({ modalState, toggle, data, setStatus }) => {
  const navigation = useNavigation();

  return (
    <Modal modalState={modalState} changeModalState={toggle}>
      <View style={styles.modalView}>
        <ModalCancel
          handlePress={() => toggle(false)}
          newSale
          cancel={(data && data.status != 0) || !data}
          navigation={navigation}
        />
        {data && data.status == 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                fontSize: 15,
                color: '#30475e',
                marginBottom: 12,
              }}>
              Ref: #{data && (data.invoice || data.id)}
            </Text>
            <Lottie
              source={require('../../lottie/payment-success.json')}
              autoPlay
              autoSize
              loop={false}
              style={styles.lottie}
            />
            <Text
              style={{
                fontFamily: 'ReadexPro-Regular',
                fontSize: 16,
                color: '#30475e',
                textAlign: 'center',
                marginHorizontal: 12,
                width: '80%',
              }}>
              {data && data.message}
            </Text>
          </View>
        )}
        {data && data.status != 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                fontSize: 15,
                color: '#30475e',
                marginBottom: 12,
              }}>
              Ref: #{data?.invoice}
            </Text>
            <Lottie
              source={require('../../lottie/116089-payment-failed.json')}
              autoPlay
              autoSize
              loop={false}
            />
            <Text
              style={{
                fontFamily: 'Lato-Semibold',
                fontSize: 16,
                color: '#30475e',
                textAlign: 'center',
                marginHorizontal: 12,
              }}>
              {data && data.message}
            </Text>
          </View>
        )}
        {data !== null && (
          <PrimaryButton
            style={styles.primaryButton}
            handlePress={async () => {
              if (data?.status == 0) {
                navigation.navigate('Receipts', {
                  invoice: data?.invoice,
                  // paymentMethod: invoice.payment,
                  cashEntered: 0,
                  // charge,
                  orderData: data,
                });
                toggle(false);
              } else {
                toggle(false);
              }
            }}>
            {data?.status == 0 ? 'Print Receipt' : 'Restart'}
          </PrimaryButton>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modal: { alignItems: 'center' },
  modalView: {
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
  },

  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 16,
  },
  primary: { marginTop: 28 },
  lottie: {
    padding: 0,
    height: 180,
  },
  invoice: {
    color: '#30475E',
    textAlign: 'center',
  },
});
export default UssdStatus;
