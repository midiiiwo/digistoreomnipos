/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useRadioButton } from '../../hooks/useRadioButton';
import { useSelector } from 'react-redux';
import { useActionCreator } from '../../hooks/useActionCreator';
import { RadioButtonProvider } from '../../context/RadioButtonContext';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import RadioButton from '../RadioButton';

const OfflinePayment = ({
  offline,
  toggleOffline,
  toggleCashConfirmed,
  navigation,
  amount,
  setAmount,
  // paymentType,
  // toggleCashModal,
  receiptNumber,
  setReceiptNumber,
  total,
}) => {
  PrimaryButton;
  const { idx } = useRadioButton();
  const { setCustomerPayment } = useActionCreator();
  const next = React.useRef(false);
  // const [amount, setAmount] = React.useState('');
  const { subTotal } = useSelector(state => state.sale);
  const { quickSaleInAction } = useSelector(state => state.quickSale);
  const checkTotal = quickSaleInAction ? subTotal : total;
  return (
    <Modal
      modalState={offline}
      changeModalState={toggleOffline}
      onModalHide={() => {
        if (next.current) {
          toggleCashConfirmed(true);
          next.current = false;
        }
      }}>
      <View style={styles.modalView}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => toggleOffline(false)}
        />

        <View
          style={[
            styles.textInputWrapper,
            { paddingRight: 0, marginBottom: 10, alignItems: 'center' },
          ]}>
          {/* <Text></Text> */}
          <TextInput
            style={[styles.textInput, { width: '91%' }]}
            placeholder="Enter Amount Received"
            textContentType="telephoneNumber"
            placeholderTextColor="#B2B2B2"
            onChangeText={setAmount}
            keyboardType="phone-pad"
            value={amount}
          />
          <View style={{ marginVertical: 8 }} />
          <TextInput
            style={[styles.textInput, { width: '91%' }]}
            placeholder="Enter Payment Receipt Number"
            // textContentType="    /"
            placeholderTextColor="#B2B2B2"
            onChangeText={setReceiptNumber}
            // keyboardType="phone-pad"
            value={receiptNumber}
          />
        </View>
        <PrimaryButton
          style={styles.primaryButton}
          disabled={
            amount.length === 0 ||
            Number(amount) < Number(checkTotal) ||
            receiptNumber.length === 0
          }
          handlePress={() => {
            // if (idx === 0) {
            //   if (customer) {
            //     setCustomerPayment({
            //       name: customer.customer_name || '',
            //       phone: customer.customer_phone || '',
            //       email: customer.customer_email || '',
            //     });
            //   }
            // } else {
            //   setCustomerPayment({
            //     name: '',
            //     phone,
            //   });
            // }
            toggleOffline(false);
            next.current = true;
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
  title: {
    width: '100%',
    alignItems: 'center',
    marginTop: 42,
  },
  choose: {
    fontFamily: 'SFProDisplay-Regular',
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
  modal: { alignItems: 'center' },
  modalView: {
    width: '50%',
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
    borderRadius: 4,
    backgroundColor: '#F5F7F9',
    // borderColor: 'rgba(96, 126, 170, 0.4)',
    // borderWidth: 0.4,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475E',
    fontSize: 18,
    paddingLeft: 14,
  },
  textInputWrapper: {
    width: '100%',
    paddingRight: 38,
  },
  option1Text: {
    color: 'rgba(48, 71, 94, 0.9)',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
  },
  customerName: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
  },
  customerNumber: {
    color: 'rgba(48, 71, 94, 0.7)',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 19,
    borderRadius: 5,
    paddingVertical: 20,
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

export default props => (
  <RadioButtonProvider>
    <OfflinePayment {...props} />
  </RadioButtonProvider>
);
