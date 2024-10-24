/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, ScrollView, View, TextInput } from 'react-native';
import React from 'react';
import Input from '../components/Input';
import { useSelector } from 'react-redux';
import { CheckItem } from './ReceiptDetails';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from 'react-native-toast-notifications';
import { useSendTransactionNotification } from '../hooks/useSendTransactionNotification';
import { useNavigation } from '@react-navigation/native';

const SendEmailInvoice = ({ route }) => {
  const { customer } = useSelector(state => state.invoice);
  const { user, outlet } = useSelector(state => state.auth);
  const { invoiceDetails, isEstimate, estimateData } = route.params;

  const navigation = useNavigation();

  const [email, setEmail] = React.useState(
    () =>
      (customer && customer.email) ||
      invoiceDetails.customer_email ||
      estimateData?.customer?.email ||
      '',
  );
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sendCopy, setSendCopy] = React.useState(false);
  // const [attachInvoice, setAttachInvoice] = React.useState(false);

  const toast = useToast();

  const { isLoading, mutate } = useSendTransactionNotification(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      if (i.status == 0) {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    }
  });

  console.log(estimateData);

  return (
    <View style={styles.main}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 12 }}>
        <Input
          placeholder="Email"
          val={email}
          setVal={text => {
            setEmail(text);
          }}
        />
        <Input
          placeholder="Subject"
          val={subject}
          setVal={text => setSubject(text)}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { minHeight: 100, paddingTop: 14 }]}
            multiline
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
            placeholder="Email message"
            placeholderTextColor="#888"
            numberOfLines={4}
          />
        </View>
        <View style={{ marginVertical: 14 }} />
        <CheckItem
          placeholder={`Send a copy to ${user.user_merchant_email}`}
          value={sendCopy}
          onValueChange={setSendCopy}
        />
        {/* <CheckItem
          placeholder="Attach the invoice as a pdf"
          value={attachInvoice}
          onValueChange={setAttachInvoice}
        /> */}
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          disabled={isLoading}
          style={styles.btn}
          handlePress={() => {
            mutate({
              customer_name:
                (customer && customer.name) ||
                invoiceDetails?.customer_name ||
                estimateData?.customer?.name ||
                '',
              customer_phone:
                (customer && customer.phone) ||
                invoiceDetails?.customer_contact ||
                estimateData?.customer?.phone ||
                '',
              customer_email: email || '',
              tran_id:
                invoiceDetails?.invoice ||
                invoiceDetails?.payment_invoice ||
                invoiceDetails?.record_no ||
                estimateData?.invoiceId ||
                '',
              tran_type: isEstimate ? 'DRAFT_INVOICE' : 'INVOICE',
              notify_type: 'EMAIL',
              merchant: user.merchant,
              mod_by:
                invoiceDetails?.created_by_name ||
                estimateData?.user ||
                user.login,
              user_merchant_email: user.user_merchant_email,
              subject,
              message,
              sendToMyself: sendCopy,
              attachInvoiceAsPDF: false,
              outlet: outlet?.outlet_id,
            });
          }}>
          {isLoading ? 'Loading' : 'Send Email'}
        </PrimaryButton>
      </View>
    </View>
  );
};

export default SendEmailInvoice;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    marginTop: 6,
  },
  input: {
    padding: 12,
    color: '#30475e',
    fontSize: 14,
    fontFamily: 'ReadexPro-Regular',
    marginTop: 12,
    borderColor: '#E8EEFC',
    borderWidth: 1.3,
    borderBottomColor: 'rgba(25, 66, 216, 1)',
    borderBottomWidth: 1.7,
    paddingVertical: 14,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
});
