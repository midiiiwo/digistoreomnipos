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
import ReceiptTaxItem from '../components/ReceiptTaxItem';
import { useSelector } from 'react-redux';

import moment from 'moment';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';
import Loading from '../components/Loading';

// moment()
const orderDate = moment().format('DD-MM-YYYY, h:mm:ss a');

const ReceiptPreview = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);

  const item = route.params.state;

  const viewRef = React.useRef();
  const cacheBust = new Date().toString();

  const { data: details, isLoading } = useGetMerchantDetails(user.merchant);

  if (isLoading) {
    return <Loading />;
  }

  const merchantDetails = details && details.data && details.data.data;

  const imgUrl =
    ((merchantDetails &&
      merchantDetails.merchant_brand_logo.length > 0 &&
      'https://payments.ipaygh.com/app/webroot/img/logo/' +
        merchantDetails.merchant_brand_logo) ||
      user.user_merchant_logo) +
    '?' +
    cacheBust;

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
                      {merchantDetails && merchantDetails.merchant_name}
                    </Text>
                  )}
                  {item.showTin && (
                    <Text style={styles.merchantDetail}>
                      Tin:{' '}
                      {merchantDetails && merchantDetails.merchant_reg_number}
                    </Text>
                  )}
                  {item.showAddress && (
                    <Text style={styles.merchantDetail}>
                      {merchantDetails && merchantDetails.merchant_address}
                    </Text>
                  )}
                  {item.showPhone && (
                    <Text style={styles.merchantDetail}>
                      Tel: {merchantDetails && merchantDetails.merchant_phone}
                    </Text>
                  )}
                  {item.showEmail && (
                    <Text style={styles.merchantDetail}>
                      Email: {merchantDetails && merchantDetails.merchant_email}
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
                      source={{
                        uri: imgUrl,
                      }}
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
              {item?.receiptWebsite?.length > 0 && (
                <View style={styles.qr}>
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontFamily: 'Inter-Regular',
                        color: '#30475e',
                        textAlign: 'center',
                        marginBottom: 12,
                        fontSize: 15,
                        marginTop: 6,
                      }}>
                      {item.receiptFooter}
                    </Text>
                    <QRCode value={item?.receiptWebsite} size={84} />
                    {/* <Text
                      style={[
                        {
                          fontFamily: 'SFProDisplay-Regular',
                          fontSize: 15,
                          color: '#30475e',
                          marginTop: 10,
                        },
                      ]}>
                      SCAN TO ORDER NEXT TIME
                    </Text>
                    <Text
                      style={[
                        {
                          fontFamily: 'SFProDisplay-Regular',
                          fontSize: 15,
                          color: '#30475e',
                          marginTop: 5,
                        },
                      ]}>
                      OR VISIT
                    </Text> */}
                    <Text
                      onPress={() =>
                        Linking.openURL('https://' + item?.receiptWebsite)
                      }
                      style={[
                        {
                          fontFamily: 'SFProDisplay-Regular',
                          fontSize: 15,
                          color: '#30475e',
                          marginTop: 5,
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      {item?.receiptWebsite}
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  marginTop: 8,
                  borderTopColor: '#ddd',
                  borderTopWidth: 0.6,
                }}>
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
