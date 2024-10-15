/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import { useNavigation } from '@react-navigation/native';
import { useRaiseOrder } from '../../hooks/useRaiseOrder';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../../hooks/useActionCreator';
import LoadingModal from '../LoadingModal';
import Lottie from 'lottie-react-native';
import PrimaryButton from '../PrimaryButton';

const StoreCreditStatus = ({
  storeCreditStatus,
  toggleStoreCreditStatus,
  cashAmount,
  charge,
}) => {
  const navigation = useNavigation();
  const { setInvoice } = useActionCreator();
  const mutation = useRaiseOrder(setInvoice);
  const { invoice } = useSelector(state => state.sale);
  return (
    <Modal
      modalState={storeCreditStatus}
      changeModalState={toggleStoreCreditStatus}>
      <View style={[styles.modalView]}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => toggleStoreCreditStatus(false)}
          newSale
          cancel={invoice && invoice.status != 0}
        />
        {(mutation.isLoading || !invoice) && <LoadingModal />}
        {!mutation.isLoading && invoice && (
          <View style={styles.paymentLabel}>
            {invoice && invoice.status == 0 && (
              <>
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
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginHorizontal: 12,
                    width: '80%',
                  }}>
                  {((invoice && invoice.message) || '').toUpperCase()}
                </Text>
              </>
            )}
            {invoice && invoice.status != 0 && (
              <>
                <Lottie
                  source={require('../../lottie/116089-payment-failed.json')}
                  autoPlay
                  autoSize
                  loop={false}
                  style={styles.lottie}
                />
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Regular',
                    fontSize: 16,
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginHorizontal: 12,
                    width: '80%',
                  }}>
                  {((invoice && invoice.message) || '').toUpperCase()}
                </Text>
              </>
            )}
            {/* <Text style={styles.status}>{data.data.message}</Text> */}
            {invoice && invoice.status == 0 && (
              <View style={{ flexDirection: 'row' }}>
                <PrimaryButton
                  handlePress={() => {
                    navigation.navigate('Receipts', {
                      invoice: invoice.id || invoice.invoice,
                      paymentMethod: invoice.payment,
                      cashEntered: cashAmount,
                      charge,
                      orderData: invoice,
                    });
                    toggleStoreCreditStatus(false);
                    setInvoice(null);
                  }}
                  style={styles.goToReceipt}>
                  Sale Receipt
                </PrimaryButton>
              </View>
            )}
            {invoice && invoice.status != 0 && (
              <PrimaryButton
                handlePress={() => {
                  toggleStoreCreditStatus(false);
                  setInvoice(null);
                  // togglePaymentDetails(true);
                }}
                style={styles.goToReceipt}>
                {/* <Text style={styles.goToReceiptText}>Restart payment</Text> */}
                Restart payment
                {/* <ArrowRight /> */}
              </PrimaryButton>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default StoreCreditStatus;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    width: '100%',
    alignItems: 'center',
    marginTop: 42,
  },
  choose: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#30475E',
  },
  amount: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 38,
    marginVertical: 12,
    color: '#30475E',
  },
  flatgrid: { marginVertical: 32, marginBottom: 0 },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  lottie: {
    height: 150,
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '56%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
  },
  group1: {
    flexDirection: 'row',
  },
  group2: {
    flexDirection: 'row',
    marginVertical: 18,
  },
  textInput: {
    borderColor: 'rgba(96, 126, 170, 0.4)',
    borderWidth: 0.4,
    width: '100%',
    paddingHorizontal: 12,
    borderRadius: 2,
    fontFamily: 'JetBrainsMono-Regular',
    color: '#30475E',
  },
  textInputWrapper: {
    width: '100%',
    paddingRight: 38,
  },
  option1Text: {
    color: 'rgba(48, 71, 94, 0.9)',
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 14,
  },
  customerName: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  customerNumber: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 19,
    borderRadius: 6,
  },
  paymentReviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  paymentReviewItemName: {
    fontFamily: 'JetBrainsMono-Regular',
    color: 'rgba(48, 71, 94, 0.99)',
    fontSize: 15,
  },
  paymentReviewItemAmount: {
    fontFamily: 'JetBrainsMono-Regular',
    color: 'rgba(48, 71, 94, 0.99)',
    fontSize: 16,
    marginLeft: 'auto',
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
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    marginTop: 19,
    paddingVertical: 16,
  },
  goToReceiptText: {
    color: '#1942D8',
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'Inter-Medium',
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
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});
