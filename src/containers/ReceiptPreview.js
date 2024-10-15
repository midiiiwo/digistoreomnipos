/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import ReceiptItem from '../components/ReceiptItem';
import ShareReceiptButton from '../components/ShareReceiptButton';
import ReceiptTaxItem from '../components/ReceiptTaxItem';
import { useSelector } from 'react-redux';

import SendNotification from '../components/Modals/SendNotification';
import moment from 'moment';

// moment()
const orderDate = moment().format('DD-MM-YYYY, h:mm:ss a');

const ReceiptPreview = ({ navigation, route }) => {
  const { customerPayment, customer } = useSelector(state => state.sale);
  const { user } = useSelector(state => state.auth);

  const item = route.params.state;

  const viewRef = React.useRef();

  console.log('invoice in receipt******', user);

  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();

  return (
    <>
      <SafeAreaView style={styles.main}>
        <ScrollView style={styles.wrapper}>
          <Text style={[styles.receipt, { textAlign: 'center' }]}>
            {item.receiptHeader}
          </Text>
          <View collapsable={false} ref={viewRef} style={{ marginTop: 12 }}>
            <View style={styles.upper}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 12,
                }}>
                <View style={{ width: '95%' }}>
                  {item.showBusiness && (
                    <Text style={styles.receipt}>
                      {user && user.user_merchant}
                    </Text>
                  )}
                  {item.showTin && (
                    <Text style={styles.merchantDetail}>
                      Tin: {user && user.user_merchant_tin}
                    </Text>
                  )}
                  {item.showAddress && (
                    <Text style={styles.merchantDetail}>
                      {user && user.user_merchant_address}
                    </Text>
                  )}
                  {item.showPhone && (
                    <Text style={styles.merchantDetail}>
                      Tel: {user.user_merchant_phone}
                    </Text>
                  )}
                  {item.showEmail && (
                    <Text style={styles.merchantDetail}>
                      Email: {user.user_merchant_email}
                    </Text>
                  )}
                </View>
                {item.showLogo && (
                  <View
                    style={{
                      marginLeft: 'auto',
                      marginRight: 12,
                    }}>
                    <Image
                      style={{ height: 90, width: 90, resizeMode: 'contain' }}
                      source={{ uri: user.user_merchant_logo }}
                    />
                  </View>
                )}
              </View>
              <View
                style={{
                  // flexDirection: 'row',
                  // paddingHorizontal: 12,
                  marginTop: 24,
                  alignItems: 'flex-start',
                }}>
                <View
                  style={{
                    marginLeft: 12,
                    marginBottom: 18,
                    // width: '75%',
                  }}>
                  <Text
                    style={[
                      styles.customerDetails,
                      { fontFamily: 'Lato-Bold', fontSize: 15 },
                    ]}>
                    RECEIPT #: XXXXXXXXXX
                  </Text>
                  <Text style={styles.customerDetails}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Medium',
                        fontSize: 15,
                        color: '#30475e',
                      }}>
                      Date & Time:
                    </Text>{' '}
                    {orderDate}
                  </Text>
                  {item.showAttendant && (
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'Lato-Medium',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Served By:
                      </Text>{' '}
                      {user.name}
                    </Text>
                  )}
                  <Text style={styles.customerDetails}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Medium',
                        fontSize: 15,
                        color: '#30475e',
                      }}>
                      Customer: XXXXXXXX 023XXXXXXX
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.scanWrapper}>
                <Text style={styles.scan}>Sale Summary</Text>
              </View>
            </View>
            <View>
              <ReceiptItem itemName="Sample Item" amount={10} quantity={1} />
              <ReceiptTaxItem taxName="VAT" amount={1} />
            </View>
            <View>
              <Text style={styles.totalAmount}>Total: GHS XX.XX</Text>
              <Text
                style={[
                  styles.totalAmount,
                  { marginTop: 0, fontFamily: 'Lato-Medium', fontSize: 16 },
                ]}>
                PAYMENT: GHS XX.XX
              </Text>
              <View style={styles.qr}>
                <View style={{ alignItems: 'center' }}>
                  <QRCode value={'123'} size={84} />
                </View>
              </View>
              <View
                style={{
                  marginTop: 8,
                  borderTopColor: '#ddd',
                  borderTopWidth: 0.6,
                }}>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginBottom: 12,
                    fontSize: 15,
                    marginTop: 6,
                  }}>
                  {item.receiptFooter}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginTop: 12,
                    fontSize: 15,
                  }}>
                  Powered by Digistore POS
                </Text>

                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginBottom: 12,
                    fontSize: 15,
                    marginTop: 6,
                  }}>
                  Visit{' '}
                  <Text
                    style={{
                      color: '#1942D8',
                      fontFamily: 'Lato-Medium',
                      fontSize: 15,
                    }}
                    onPress={() =>
                      Linking.openURL('https://sell.digistoreafrica.com/')
                    }>
                    www.digistoreafrica.com
                  </Text>{' '}
                  for more details
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* <ShareReceiptButton
        viewRef={viewRef}
        orderNumber={123}
        paymentId={123}
        toggleNotification={toggleNotification}
        setNotificationType={setNotificationType}
        amount={123}
        customerName={customer && customer.customer_name}
        customerPhone={customerPayment && customerPayment.phone}
        date={orderDate}
      />
      {notification && (
        <SendNotification
          notification={notification}
          toggleNotification={toggleNotification}
          navigation={navigation}
          notificationType={notificationType}
          tran_id={123}
        />
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'scroll',
  },
  wrapper: {
    marginHorizontal: 16,
    flex: 1,
  },
  upper: {
    // alignItems: 'center',
    // marginTop: 10,
    marginBottom: 20,
  },
  customerDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#30475e',
  },
  merchantDetail: {
    fontFamily: 'Lato-Regular',
    color: '#5C6E91',
    fontSize: 15,
    width: '64%',
    marginTop: 3,
    marginBottom: 1,
  },
  receipt: {
    fontFamily: 'Lato-Semibold',
    fontSize: 17,
    color: '#30475E',
    marginBottom: 6,
  },
  scanWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingBottom: 4,
  },
  scan: {
    color: '#30475E',
    marginRight: 2,
    fontFamily: 'Lato-Semibold',
    fontSize: 16,
  },
  qr: {
    marginVertical: 12,
    // alignItems: 'center',
    // flexDirection: 'row',
  },
  itemList: {
    marginTop: 20,
  },
  flatList: {
    marginTop: 22,
    // backgroundColor: 'red',
    flex: 1,
  },
  totalAmount: {
    fontFamily: 'Lato-Semibold',
    fontSize: 18,
    color: '#30475E',
    marginLeft: 'auto',
    marginBottom: 8,
    marginRight: 10,
    marginTop: 12,
  },
});

export default ReceiptPreview;
