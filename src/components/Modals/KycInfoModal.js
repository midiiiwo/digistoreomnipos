/* eslint-disable react-native/no-inline-styles */
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Warning from '../../../assets/icons/Info';
import Modal from '../Modal';
const KycInfoModal = ({ dialog, setDialog }) => {
  return (
    <Modal modalState={dialog} changeModalState={setDialog}>
      <View style={styles.modalView}>
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Warning height={40} width={40} />
        </View>
        <Text
          style={{
            fontFamily: 'Lato-Semibold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginVertical: 10,
            width: '85%',
          }}>
          Our payment service and bank partners require this information to
          comply with Know Your Customer (KYC) regulations and to protect your
          business funds
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Semibold',
            fontSize: 16,
            color: '#30475e',
            textAlign: 'center',
            marginVertical: 10,
            width: '85%',
          }}>
          All data collected is governed by our{' '}
          <Text
            onPress={() =>
              Linking.openURL('https://sell.digistoreafrica.com/privacy')
            }
            style={{
              fontFamily: 'Lato-Semibold',
              fontSize: 16,
              color: 'rgba(25, 66, 216, 0.9)',
            }}>
            Privacy Policy
          </Text>
        </Text>
        <Pressable
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              padding: 14,
              marginTop: 12,
            },
          ]}
          onPress={async () => {
            setDialog(false);
          }}>
          <Text style={[styles.signin, { color: 'rgba(25, 66, 216, 0.9)' }]}>
            Dismiss
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default KycInfoModal;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
    width: '100%',
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '96%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 26,
    paddingBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
