/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import Modal from '../Modal';
import ModalCancel from '../ModalCancel';
import PrimaryButton from '../PrimaryButton';
import { useSelector } from 'react-redux';
import { useSendTransactionNotification } from '../../hooks/useSendTransactionNotification';
import { useToast } from 'react-native-toast-notifications';

const SendNotification = ({
  notification,
  toggleNotification,
  navigation,
  notificationType,
  tran_id,
}) => {
  const toast = useToast();
  const { user } = useSelector(state => state.auth);
  // const {} = useSelector(state => state.sale);
  // const { data, isLoading, isFetching } = useGetTransactionFee(
  //   mapPaymentToChannel[payment],
  //   amount,
  //   user.merchant,
  // );
  const [sendStatus, setSendStatus] = React.useState();

  const { mutate, isLoading } = useSendTransactionNotification(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      setSendStatus(i);
    }
  });

  const { quickSaleInAction } = useSelector(state => state.quickSale);
  const [smsOrEmail, setSmsOrEmail] = React.useState('');

  const payload = {
    tran_id,
    tran_type: quickSaleInAction ? 'PAYMENT' : 'ORDER',
    notify_type: notificationType === 'email' ? 'EMAIL' : 'SMS',
    customer_phone: notificationType === 'sms' ? smsOrEmail : '',
    customer_email: notificationType === 'email' ? smsOrEmail : '',
    merchant: user.merchant,
    mod_by: 'CUSTOMER',
    // tracking_email: 'pherut@gmail.com',
    // tracking_url: 'http://buy.digistoreafrica.com',
  };

  return (
    <Modal modalState={notification} changeModalState={toggleNotification}>
      <View style={styles.modalView}>
        <ModalCancel
          navigation={navigation}
          handlePress={() => toggleNotification(false)}
          extraStyle={{ width: '92%' }}
          cancelText="Done"
        />
        <View style={{ paddingVertical: 12 }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              fontSize: 18,
              color: '#30475e',
              textAlign: 'center',
              letterSpacing: 0.2,
            }}>
            Send receipt to customer through{' '}
            {notificationType === 'email' ? 'email' : 'SMS'}
          </Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={
            notificationType === 'email'
              ? 'Enter email address'
              : 'Enter phone number'
          }
          // autoFocus
          placeholderTextColor="#B2B2B2"
          onChangeText={setSmsOrEmail}
          value={smsOrEmail}
          keyboardType={
            notificationType === 'email' ? 'email-address' : 'phone-pad'
          }
        />
        <PrimaryButton
          style={styles.primaryButton}
          disabled={sendStatus && sendStatus.status == 0}
          handlePress={() => {
            // togg(false);
            // toggleCashConfirmed(true);
            console.log('payload---<', payload);
            mutate(payload);
          }}>
          {isLoading
            ? 'Sending'
            : notificationType === 'email'
            ? !sendStatus
              ? 'Send email'
              : sendStatus.status == 0
              ? 'Sent'
              : 'Failed'
            : !sendStatus
            ? 'Send sms'
            : sendStatus.status == 0
            ? 'Sent'
            : 'Failed'}
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
    paddingVertical: 20,
    paddingHorizontal: 12,
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475E',
    fontSize: 18,
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
    paddingVertical: 20,
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
export default SendNotification;
