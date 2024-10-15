import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import { useGetTransactionDetails } from '../../hooks/useGetTransactionDetails';
import { useSelector } from 'react-redux';
import { PaymentReviewItem } from './CustomerDetails';
import LoadingModal from '../LoadingModal';

const NotificationModal = ({ toggleModal, setToggleModal, id }) => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetTransactionDetails(
    user.user_merchant_receivable,
    id,
  );
  return (
    <Modal modalState={toggleModal} changeModalState={setToggleModal}>
      <View style={styles.modalView}>
        {isLoading && <LoadingModal />}
        {!isLoading && (
          <>
            <PaymentReviewItem
              name="Invoice"
              amount={data && data.data && data.data.data.payment_invoice}
              showCurrency={false}
            />
            <PaymentReviewItem
              name="Fee Amt"
              amount={data && data.data && data.data.data.transaction_charge}
            />
            <PaymentReviewItem
              name="Set Amt"
              amount={data && data.data && data.data.data.bill_amount}
            />
            <PaymentReviewItem
              name="Date"
              amount={data && data.data && data.data.data.transaction_date}
              showCurrency={false}
            />
            <PaymentReviewItem
              name="Payment No"
              amount={data && data.data && data.data.data.payment_number}
              showCurrency={false}
            />
            <PaymentReviewItem
              name="Ref"
              amount={data && data.data && data.data.data.payment_reference}
              showCurrency={false}
            />
            <PaymentReviewItem
              name="Description"
              amount={data && data.data && data.data.data.payment_description}
              showCurrency={false}
            />
            {/* <PaymentReviewItem name="" amount={}/> */}
          </>
        )}

        <PrimaryButton
          style={styles.primaryButton}
          handlePress={() => {
            setToggleModal(false);
          }}>
          Close
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

  flatgrid: { marginVertical: 32, marginBottom: 0 },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: { alignItems: 'center' },
  modalView: {
    width: '56%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 26,
    paddingBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  group1: {
    flexDirection: 'row',
  },
  group2: {
    flexDirection: 'row',
    marginVertical: 18,
  },
  textInput: {
    borderRadius: 4,
    backgroundColor: '#F5F7F9',
    width: '96%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Medium',
    color: '#30475E',
    fontSize: 16,
    paddingLeft: 14,
    marginTop: 22,
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
    borderRadius: 5,
    paddingVertical: 16,
    width: '100%',
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
  },
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});
export default NotificationModal;
