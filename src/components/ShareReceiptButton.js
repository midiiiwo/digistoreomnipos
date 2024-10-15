/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import { SheetManager } from 'react-native-actions-sheet';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useToast } from 'react-native-toast-notifications';
import RNFS from 'react-native-fs';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import { MenuProvider } from 'react-native-popup-menu';
// import { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
// import { BLEPrinter } from 'react-native-thermal-receipt-printer';
import { PermissionsAndroid } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import Print from '../../assets/icons/print.svg';
import Email from '../../assets/icons/email.svg';
import PdfIcon from '../../assets/icons/pdf.svg';
import ShareIcon from '../../assets/icons/share.svg';
import { useSendTransactionNotification } from '../hooks/useSendTransactionNotification';
import { useSelector } from 'react-redux';
import SendNotification from './Modals/SendNotification';
import { printEcobank } from '../modules/printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { print } from 'react-native-print';
//
const ButtonItem = ({ Icon, label, handlePress, style }) => {
  return (
    <Pressable style={[styles.bItem, style]} onPress={handlePress}>
      <Icon height={32} width={32} style={styles.icon} stroke="#fff" />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const ShareReceiptButton = ({
  width,
  viewRef,
  orderNumber,
  paymentId,
  navigation,
  toggleNotification,
  setNotificationType,
  amount,
  customerName,
  customerPhone,
  charge,
  tType,
  date,
  description,
}) => {
  const { customerPayment } = useSelector(state => state.sale);
  const [openMenu, setOpenMenu] = React.useState(false);
  console.log(customerPayment);
  console.log('tttttttttttttttyp', tType);
  const { bottom } = useSafeAreaInsets();
  // const [notification, toggleNotification] = React.useState(false);
  // const [notificationType, setNotificationType] = React.useState();
  const toast = useToast();
  const { quickSaleInAction } = useSelector(state => state.quickSale);
  // const [sendStatus, setSendStatus] = React.useState();
  const { mutate, isLoading } = useSendTransactionNotification(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
    }
  });
  const text =
    '[C]<img>https://via.placeholder.com/300.jpg</img>\n' +
    '[L]\n' +
    "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    '[L]<b>BEAUTIFUL SHIRT</b>[R]9.99e\n' +
    '[L]  + Size : S\n' +
    '[L]\n' +
    '[L]<b>AWESOME HAT</b>[R]24.99e\n' +
    '[L]  + Size : 57/58\n' +
    '[L]\n' +
    '[C]--------------------------------\n' +
    '[R]TOTAL PRICE :[R]34.98e\n' +
    '[R]TAX :[R]4.23e\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    "[L]<font size='tall'>Customer :</font>\n" +
    '[L]Raymond DUPONT\n' +
    '[L]5 rue des girafes\n' +
    '[L]31547 PERPETES\n' +
    '[L]Tel : +33801201456\n' +
    '[L]\n' +
    "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
    "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>\n" +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n';
  const [printers, setPrinters] = React.useState([]);
  const { user } = useSelector(state => state.auth);
  const payload = {
    tran_id: paymentId,
    tran_type: quickSaleInAction ? 'PAYMENT' : 'ORDER',
    notify_type: '',
    merchant: user.merchant,
    mod_by: 'CUSTOMER',
    // tracking_email: 'pherut@gmail.com',
    // tracking_url: 'http://buy.digistoreafrica.com',
  };

  // React.useEffect(() => {
  //   console.log('calllllll');
  //   const init = async () => {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //       {
  //         title: '',
  //         // message:
  //         //   'Cool Photo App needs access to your camera ' +
  //         //   'so you can take awesome pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     console.log(granted);
  //     if (granted === 'granted') {
  //     }
  //     BLEPrinter.init().then(() => {
  //       BLEPrinter.getDeviceList().then(setPrinters);
  //     });
  //     // console.log(printers);
  //   };
  //   init();
  // }, []);

  // React.useEffect(() => {
  //   if (sendStatus) {
  //     toast.show(sendStatus.message);
  //   }
  // }, [sendStatus, toast]);

  // console.log('current printer------', curentPrinter);

  console.log('ordedddd', date);

  return (
    <View
      style={[
        styles.main,
        { width, paddingBottom: bottom, height: 80 + bottom },
      ]}>
      {user.user_merchant_agent == '6' && (
        <View
          // onPress={() => setOpenMenu(!openMenu)}
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            borderRightColor: 'rgba(146, 169, 189, 0.2)',
            borderRightWidth: 1,
          }}>
          <Menu
            style={{ width: '100%' }}
            opened={openMenu}
            onBackdropPress={() => setOpenMenu(false)}>
            <MenuTrigger
              onPress={() => {
                setOpenMenu(!openMenu);
              }}
              children={
                <ButtonItem
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                  handlePress={() => setOpenMenu(!openMenu)}
                  // handlePress={() => {
                  //   captureRef(viewRef, {
                  //     format: 'png',
                  //     result: 'base64',
                  //   }).then(uri => {
                  //     // SheetManager.show('receipt', {
                  //     //   payload: { uri: 'data:image/png;base64,' + uri },
                  //     // });
                  //   });
                  // }}
                  label="Print"
                  Icon={Print}
                />
              }
            />
            <MenuOptions
              optionsContainerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                paddingBottom: 16,
                borderRadius: 6,
                marginLeft: 14,

                // elevation: 0,
              }}>
              <MenuOption
                key={'MERCHANT'}
                style={{ marginVertical: 10 }}
                onSelect={async () => {
                  const dups = await AsyncStorage.getItem('duplicates');
                  if (!dups) {
                    const duplicates = [paymentId];
                    await AsyncStorage.setItem(
                      'duplicates',
                      JSON.stringify(duplicates),
                    );
                    printEcobank(
                      user.user_merchant,
                      user.merchant,
                      user.user_merchant_phone,
                      paymentId,
                      'MERCHANT COPY',
                      '',
                      date,
                      tType,
                      customerName,
                      customerPhone,
                      description,
                      charge,
                      amount,
                      amount,
                    );
                  } else {
                    const parsedDups = JSON.parse(dups);
                    if (parsedDups.includes(paymentId)) {
                      printEcobank(
                        user.user_merchant,
                        user.merchant,
                        user.user_merchant_phone,
                        paymentId,
                        'MERCHANT COPY',
                        '',
                        date,
                        tType,
                        customerName,
                        customerPhone,
                        description,
                        charge,
                        amount,
                        amount,
                        'DUPLICATE',
                      );
                    } else {
                      parsedDups.push(paymentId);
                      await AsyncStorage.setItem(
                        'duplicates',
                        JSON.stringify(parsedDups),
                      );
                      printEcobank(
                        user.user_merchant,
                        user.merchant,
                        user.user_merchant_phone,
                        paymentId,
                        'MERCHANT COPY',
                        '',
                        date,
                        tType,
                        customerName,
                        customerPhone,
                        description,
                        charge,
                        amount,
                        amount,
                      );
                    }
                  }

                  setOpenMenu(false);
                }}>
                <Text
                  style={{
                    color: '#30475e',
                    fontFamily: 'Inter-Medium',
                    fontSize: 15,
                  }}>
                  Merchant Copy
                </Text>
              </MenuOption>
              <MenuOption
                key={'CUSTOMER'}
                style={{ marginVertical: 10 }}
                onSelect={async () => {
                  const dups = await AsyncStorage.getItem('duplicates');
                  if (!dups) {
                    const duplicates = [paymentId];
                    await AsyncStorage.setItem(
                      'duplicates',
                      JSON.stringify(duplicates),
                    );
                    printEcobank(
                      user.user_merchant,
                      user.merchant,
                      user.user_merchant_phone,
                      paymentId,
                      'CUSTOMER COPY',
                      '',
                      date,
                      tType,
                      customerName,
                      customerPhone,
                      description,
                      charge,
                      amount,
                      amount,
                    );
                  } else {
                    const parsedDups = JSON.parse(dups);
                    if (parsedDups.includes(paymentId)) {
                      printEcobank(
                        user.user_merchant,
                        user.merchant,
                        user.user_merchant_phone,
                        paymentId,
                        'DUPLICATE',
                        '',
                        date,
                        tType,
                        customerName,
                        customerPhone,
                        description,
                        charge,
                        amount,
                        amount,
                      );
                    } else {
                      parsedDups.push(paymentId);
                      await AsyncStorage.setItem(
                        'duplicates',
                        JSON.stringify(parsedDups),
                      );
                      printEcobank(
                        user.user_merchant,
                        user.merchant,
                        user.user_merchant_phone,
                        paymentId,
                        'CUSTOMER COPY',
                        '',
                        date,
                        tType,
                        customerName,
                        customerPhone,
                        description,
                        charge,
                        amount,
                        amount,
                      );
                    }
                  }
                  setOpenMenu(false);
                }}>
                <Text
                  style={{
                    color: '#30475e',
                    fontFamily: 'Inter-Medium',
                    fontSize: 15,
                  }}>
                  Customer Copy
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      )}

      {user.user_merchant_agent != '6' && (
        <ButtonItem
          style={{
            flex: 1,
            borderRightColor: 'rgba(146, 169, 189, 0.2)',
            borderRightWidth: 1,
          }}
          label="Print"
          Icon={Print}
          handlePress={() => {
            captureRef(viewRef, {
              format: 'png',
              result: 'base64',
            }).then(async uri => {
              // let results;
              var htmlString = `<div style="height: 100%; width: 100%"><img src="data:image/png;base64,${uri}" style="width: "100%";"/></div>`;
              try {
                // results = await RNHTMLtoPDF.convert({
                //   html: htmlString,
                //   fileName: 'test',
                //   base64: true,
                // });
                // console.log('pppppp', print);
                // await print({
                //   html: htmlString,
                // });
              } catch (error) {
                console.error(error);
                toast.show('Error generating pdf, try again');
              }
            });
          }}
        />
      )}

      <ButtonItem
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="Email"
        Icon={Email}
        handlePress={() => {
          if (!customerPayment) {
            setNotificationType('email');
            toggleNotification(true);
            return;
          }
          if (!customerPayment.email || customerPayment.email.length === 0) {
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
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="Share"
        Icon={ShareIcon}
        handlePress={() => {
          console.log('viewref: ', viewRef);
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
        style={{
          flex: 1,
          borderRightColor: 'rgba(146, 169, 189, 0.2)',
          borderRightWidth: 1,
        }}
        label="Sms"
        Icon={PdfIcon}
        handlePress={() => {
          // console.log(customerPayment.phone);
          if (!customerPayment) {
            setNotificationType('sms');
            toggleNotification(true);
            return;
          }
          if (customerPayment && !customerPayment.phone) {
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
    // flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
});

export default ShareReceiptButton;
