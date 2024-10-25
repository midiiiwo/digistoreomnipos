/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import { useToast } from 'react-native-toast-notifications';

import Email from '../../assets/icons/email.svg';
import ShareIcon from '../../assets/icons/share.svg';
import SMSIcon from '../../assets/icons/pdf.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSendTransactionNotification } from '../hooks/useSendTransactionNotification';
import { useSelector } from 'react-redux';
// import { print } from 'react-native-print';
//
const ButtonItem = ({ Icon, label, handlePress, style }) => {
  return (
    <TouchableOpacity style={[styles.bItem, style]} onPress={handlePress}>
      <Icon height={32} width={32} style={styles.icon} stroke="#fff" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const InvoiceSendButton = ({
  pdfPath,
  invoiceLink,
  isEstimate,
  estimateData,
}) => {
  const { bottom } = useSafeAreaInsets();

  const toast = useToast();
  const navigation = useNavigation();

  const { customer } = useSelector(state => state.invoice);

  const { user, outlet } = useSelector(state => state.auth);

  const { mutate } = useSendTransactionNotification(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
    }
  });

  return (
    <View style={[styles.main, { paddingBottom: bottom, height: 80 + bottom }]}>
      <ButtonItem
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="Email"
        Icon={Email}
        handlePress={() => {
          navigation.navigate('Send Email Invoice', {
            invoiceDetails: invoiceLink,
            isEstimate,
            estimateData,
          });
        }}
      />
      <ButtonItem
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="Share"
        Icon={ShareIcon}
        handlePress={async () => {
          try {
            await Share.open({
              title: 'Share Invoice Link',
              url:
                'data:application/pdf;base64,' +
                ((pdfPath && pdfPath.base64) || ''),
            });
          } catch (error) {
            toast.show('Invoice not shared');
          }
        }}
      />
      <ButtonItem
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="SMS"
        Icon={SMSIcon}
        handlePress={async () => {
          toast.show('Sending sms...', { placement: 'top' });
          mutate({
            tran_id:
              invoiceLink?.invoice ||
              invoiceLink?.payment_invoice ||
              invoiceLink?.record_no ||
              estimateData?.invoiceId ||
              '',
            tran_type: isEstimate ? 'DRAFT_INVOICE' : 'INVOICE',
            notify_type: 'SMS',
            customer_phone:
              customer?.phone ||
              invoiceLink?.customer_contact ||
              estimateData?.customer?.phone ||
              '',
            merchant: user.merchant,
            mod_by: user.login,
            notify_message: '',
            outlet: outlet?.outlet_id,
          });
        }}
      />

      {/* <ButtonItem
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="Download"
        Icon={Download}
        handlePress={() => {
          // console.log(customerPayment.phone);
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 66, 216, 0.9)',
    height: 80,
    width: '100%',
  },
  text: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  bItem: {
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
});

export default InvoiceSendButton;
