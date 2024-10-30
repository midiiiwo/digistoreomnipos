import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useToast } from 'react-native-toast-notifications';

import Print from '../../assets/icons/print.svg';
import Email from '../../assets/icons/email.svg';
import PdfIcon from '../../assets/icons/pdf.svg';
import ShareIcon from '../../assets/icons/share.svg';
import { useSendTransactionNotification } from '../hooks/useSendTransactionNotification';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ButtonItem = ({ Icon, label, handlePress }) => {
  return (
    <Pressable style={styles.bItem} onPress={handlePress}>
      <Icon height={32} width={32} style={styles.icon} stroke="#fff" />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const BillReceiptShareButton = ({
  width,
  viewRef,
  orderNumber,
  paymentId,
  mobileNumber,
  toggleNotification,
  setNotificationType,
}) => {
  const { customerPayment } = useSelector(state => state.sale);
  // const [notification, toggleNotification] = React.useState(false);
  // const [notificationType, setNotificationType] = React.useState();
  const toast = useToast();
  // const [sendStatus, setSendStatus] = React.useState();
  const { mutate, isLoading } = useSendTransactionNotification(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
    }
  });
  const { user } = useSelector(state => state.auth);
  const { bottom } = useSafeAreaInsets();
  const payload = {
    tran_id: paymentId,
    tran_type: 'PAYPOINT',
    notify_type: '',
    merchant: user.merchant,
    mod_by: user.login,
    notify_message: '',

    // tracking_email: 'pherut@gmail.com',
    // tracking_url: 'http://buy.digistoreafrica.com',
  };

  // React.useEffect(() => {
  //   if (sendStatus) {
  //     toast.show(sendStatus.message);
  //   }
  // }, [sendStatus, toast]);

  return (
    <View
      style={[
        styles.main,
        { width, paddingBottom: bottom, height: 80 + bottom },
      ]}>
      <ButtonItem
        handlePress={() => {
          return;
          // captureRef(viewRef, {
          //   format: 'png',
          //   result: 'base64',
          // }).then(uri => {
          //   SheetManager.show('receipt', {
          //     payload: { uri: 'data:image/png;base64,' + uri },
          //   });
          // });
        }}
        label="Print"
        Icon={Print}
      />
      <ButtonItem
        label="Email"
        Icon={Email}
        handlePress={() => {
          if (!customerPayment) {
            setNotificationType('email');
            toggleNotification(true);
            return;
          }
          if (!customerPayment.email) {
            setNotificationType('email');
            toggleNotification(true);
            return;
          }
          payload.notify_type = 'EMAIL';
          mutate(payload);
          toast.show('Sending Email', { placement: 'top' });
        }}
      />
      <ButtonItem
        label="Share"
        Icon={ShareIcon}
        handlePress={() => {
          captureRef(viewRef, {
            format: 'png',
            result: 'base64',
          }).then(async uri => {
            let results;
            var htmlString = `<div style="height: 100%; width: 100%"><img src="data:image/png;base64,${uri}" style="width: "100%";"/></div>`;
            try {
              results = await RNHTMLtoPDF.convert({
                html: htmlString,
                fileName: 'test',
                base64: true,
              });
            } catch (error) {
              toast.show('Error generating pdf, try again');
            }
            try {
              const res = await Share.open(
                {
                  title: 'Share receipt',
                  url: 'data:application/pdf;base64,' + results.base64,
                },
                {},
              );
              if (res.success) {
                toast.show('Share success');
              }
            } catch (error) {
              // toast.show('Share unsuccessfu');
            }
          });
        }}
      />

      <ButtonItem
        label="Sms"
        Icon={PdfIcon}
        handlePress={() => {
          // console.log(customerPayment.phone);
          if (!mobileNumber || mobileNumber.length === 0) {
            setNotificationType('sms');
            toggleNotification(true);
            return;
          }
          payload.notify_type = 'SMS';
          mutate(payload);
          if (!isLoading) {
            toast.show('Sending SMS', { placement: 'top' });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 66, 216, 0.9)',
    height: 80,
    width: '80%',
  },
  text: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  bItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // borderRightColor: 'rgba(146, 169, 189, 0.2)',
    // borderRightWidth: 1,
  },
  icon: {
    marginBottom: 4,
  },
});

export default BillReceiptShareButton;
