/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PrimaryButton from '../PrimaryButton';
import { StyleSheet, Text, View } from 'react-native';
import ModalCancel from '../ModalCancel';
import Modal from '../Modal';
import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useRaiseOrder } from '../../hooks/useRaiseOrder';
import LoadingModal from '../LoadingModal';
import Info from '../../../assets/icons/Info';
import Share from 'react-native-share';

const PaymentInstructionsModal = ({
  paymentInstructions,
  togglePaymentInstructions,
  togglePaymentConfirmed,
  navigation,
}) => {
  const { invoice } = useSelector(state => state.sale);

  console.log('invoice: ', invoice);
  const next = React.useRef(false);
  // const { refetch } = useGetPaymentStatus(
  //   user.merchant,
  //   quickSaleInAction ? invoice && invoice.id : invoice && invoice.invoice,
  //   false,
  // );

  const { setInvoice } = useActionCreator();

  const mutation = useRaiseOrder(setInvoice);

  return (
    <Modal
      modalState={paymentInstructions}
      changeModalState={togglePaymentInstructions}
      onModalHide={() => {
        if (next.current) {
          togglePaymentConfirmed(true);
          next.current = false;
        }
      }}>
      <View style={[styles.modalView]}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => {
            togglePaymentInstructions(false);
            setInvoice(null);
          }}
          newSale={invoice && invoice.payment === 'CARD'}
        />
        {(mutation.isLoading || !invoice) && <LoadingModal />}
        {!mutation.isLoading && invoice && (
          <View>
            <View style={{ alignItems: 'center', paddingVertical: 14 }}>
              <Info height={40} width={40} />
            </View>
            <Text style={styles.invoice}>{invoice.message}</Text>
          </View>
        )}
        {invoice && (
          <PrimaryButton
            style={styles.primaryButton}
            handlePress={() => {
              if (invoice && invoice.status != 0) {
                togglePaymentInstructions(false);
                setInvoice(null);
                return;
              }
              if (
                invoice &&
                invoice.status == 0 &&
                (invoice.payment === 'CASH' || invoice.payment === 'CARD')
              ) {
                navigation.navigate('Receipts', {
                  invoice: invoice && (invoice.invoice || invoice.id),
                  paymentMethod: invoice.payment,
                  orderData: invoice,
                });
                setInvoice(null);
                togglePaymentInstructions(false);
                return;
              }
              // refetch();
              next.current = true;
              togglePaymentInstructions(false);
            }}>
            {!invoice || (invoice && invoice.status == 0)
              ? invoice &&
                (invoice.payment === 'CASH' || invoice.payment === 'CARD')
                ? 'Receipt'
                : 'Confirm Payment'
              : 'Restart Payment'}
          </PrimaryButton>
        )}
        {invoice &&
          invoice.payment === 'CARD' &&
          invoice &&
          invoice.status == 0 && (
            <PrimaryButton
              style={[styles.primaryButton, { marginTop: 12 }]}
              handlePress={async () => {
                await Share.open({
                  title: 'Share Payment Link',
                  url: invoice.invoice_url,
                });
              }}>
              Share Payment Link
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
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14.8,
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});
export default PaymentInstructionsModal;
