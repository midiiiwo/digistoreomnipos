/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import { useSelector } from 'react-redux';

const CashModal = ({
  cashModal,
  toggleCashModal,
  toggleCashConfirmed,
  amount,
  setAmount,
  navigation,
  total,
}) => {
  // const { user } = useSelector(state => state.auth);
  // const {} = useSelector(state => state.sale);
  // const { data, isLoading, isFetching } = useGetTransactionFee(
  //   mapPaymentToChannel[payment],
  //   amount,
  //   user.merchant,
  // );
  const { subTotal } = useSelector(state => state.sale);
  const { quickSaleInAction } = useSelector(state => state.quickSale);
  const checkTotal = quickSaleInAction ? subTotal : total;
  const inputRef = React.useRef();
  const next = React.useRef(false);
  return (
    <Modal
      modalState={cashModal}
      changeModalState={toggleCashModal}
      onModalHide={() => {
        if (next.current) {
          toggleCashConfirmed(true);
          next.current = false;
        }
      }}>
      <View style={styles.modalView}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => toggleCashModal(false)}
          extraStyle={{ width: '92%' }}
        />
        <Text
          style={{
            fontFamily: 'SFProDisplay-Regular',
            fontSize: 15,
            color: '#30475e',
            textAlign: 'center',
            marginVertical: 8,
          }}>
          ENTER AMOUNT RECEIVED
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Amount received"
          placeholderTextColor="#B2B2B2"
          onChangeText={setAmount}
          value={amount}
          keyboardType="phone-pad"
          ref={inputRef}
        />
        <PrimaryButton
          style={styles.primaryButton}
          disabled={amount.length === 0 || Number(amount) < Number(checkTotal)}
          handlePress={() => {
            toggleCashModal(false);
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
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475E',
    fontSize: 16,
    paddingLeft: 14,
    marginTop: 12,
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
  status: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#30475e',
  },
});
export default CashModal;
