/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import { useSelector } from 'react-redux';
import LoadingModal from '../LoadingModal';
import Lottie from 'lottie-react-native';
import { useQueryClient } from 'react-query';
import { useActionCreator } from '../../hooks/useActionCreator';
const CashPaymentStatus = ({
  toggleCashPaymentStatus,
  cashPaymentStatus,
  payment,
  navigation,
  cashAmount,
}) => {
  const { setInvoice } = useActionCreator();
  useQueryClient().setQueryData('transaction-fee', null);
  const { invoice } = useSelector(state => state.sale);
  console.log('ivnvid---->', invoice);
  return (
    <Modal
      modalState={cashPaymentStatus}
      changeModalState={toggleCashPaymentStatus}>
      <View style={styles.modalView}>
        <ModalCancel
          handlePress={() => {
            toggleCashPaymentStatus(false);
            setInvoice(null);
          }}
          newSale
          cancel={(invoice && invoice.status != 0) || !invoice}
          navigation={navigation}
        />
        {!invoice && <LoadingModal />}
        {invoice && invoice.status == 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
                color: '#30475e',
                marginBottom: 12,
              }}>
              Ref: #{invoice && (invoice.id || invoice.invoice)}
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
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 16,
                color: '#30475e',
                textAlign: 'center',
                marginHorizontal: 12,
                width: '80%',
              }}>
              {invoice && invoice.message}
            </Text>
          </View>
        )}
        {invoice && invoice.status != 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 15,
                color: '#30475e',
                marginBottom: 0,
              }}>
              Ref: #{invoice && invoice.id}
            </Text>
            <Lottie
              source={require('../../lottie/116089-payment-failed.json')}
              autoPlay
              autoSize
              loop={false}
            />
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 16,
                color: '#30475e',
                textAlign: 'center',
                marginHorizontal: 12,
              }}>
              {invoice && invoice.message}
            </Text>
          </View>
        )}
        <PrimaryButton
          style={styles.primaryButton}
          handlePress={() => {
            if (invoice && invoice.status == 0) {
              toggleCashPaymentStatus(false);
              navigation.navigate('Receipts', {
                invoice: invoice.id || invoice.invoice,
                paymentMethod:
                  (invoice.data && invoice.data.PAYMENT_CHANNEL) ||
                  invoice.payment,
                cashEntered: cashAmount,
                transactionId:
                  (invoice && invoice.data && invoice.data.TRANSACTION_ID) ||
                  invoice.id ||
                  invoice.invoice,
                orderData: invoice,
              });
              setInvoice(null);
              return;
            }
            setInvoice(null);
            toggleCashPaymentStatus(false);
          }}>
          {!invoice
            ? 'Processing'
            : invoice.status == 0
            ? 'Sale receipt'
            : 'Restart payment'}
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

  modal: { alignItems: 'center' },
  modalView: {
    width: '50%',
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
export default CashPaymentStatus;
