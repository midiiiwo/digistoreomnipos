/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PrimaryButton from '../PrimaryButton';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../Modal';

import Info from '../../../assets/icons/Info.svg';

import { useNavigation } from '@react-navigation/native';

const SessionExpired = ({ sessionStatus, toggleSessionStatus }) => {
  const navigation = useNavigation();
  return (
    <Modal modalState={sessionStatus}>
      <View style={[styles.modalView]}>
        <View>
          <View style={{ alignItems: 'center', paddingVertical: 14 }}>
            <Info height={40} width={40} />
          </View>

          <Text style={styles.invoice}>Your session has expired.</Text>
        </View>
        <PrimaryButton
          style={styles.primaryButton}
          handlePress={async () => {
            navigation.navigate('Logout');
            toggleSessionStatus(false);
          }}>
          Proceed
        </PrimaryButton>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
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

  margin: {
    marginTop: 18,
    borderTopColor: 'solid rgba(146, 169, 189, 0.4)',
    borderTopWidth: 0.4,
    marginBottom: 6,
  },
  primary: { marginTop: 28 },
  container: {
    justifyContent: 'space-between',
  },
  paymentLabel: { width: '100%', alignItems: 'center' },
  paymentReceivedLabel: { width: '100%', alignItems: 'center', paddingTop: 40 },
  paymentReceivedText: {
    color: '#30475E',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 16,
    marginTop: 18,
  },
  goToReceipt: {
    flexDirection: 'row',
    marginTop: 70,
    alignItems: 'center',
  },
  goToReceiptText: {
    color: '#1942D8',
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'JetBrainsMono-Regular',
    letterSpacing: -0.2,
  },
  totalAmount: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 22,
    marginTop: 14,
    color: '#30475E',
  },
  invoice: {
    color: '#30475E',
    textAlign: 'center',
    marginHorizontal: 14,
    fontFamily: 'SQ Market Regular Regular',
    fontSize: 15,
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});
export default SessionExpired;
