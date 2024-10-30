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

import ReceiptTaxItem from '../components/ReceiptTaxItem';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import SendNotification from '../components/Modals/SendNotification';
import moment from 'moment';
import BillReceiptShareButton from '../components/BillReceiptShareButton';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';

const mapPaymentChannelToName = {
  SMTNMM: 'MTN Mobile Money',
  SVODAC: 'Vodafone Cash',
  SARTLM: 'AirtelTigo Money',
  STIGOC: 'Tigo Cash',
  MTNMM: 'MTN Mobile Money',
  VODAC: 'Vodafone Cash',
  AIRTELM: 'AirtelTigo Money',
  TIGOC: 'AirtelTigo Money',
  UNKNOWN: 'Unknown',
  DISC: 'Discount',
  CASH: 'Cash',
};

// moment()
const orderDate = moment().format('DD-MM-YYYY, h:mm:ss a');

const SendMoneyReceipt = ({ route, navigation }) => {
  const { user } = useSelector(state => state.auth);

  const viewRef = React.useRef();
  const cacheBust = new Date().toString();

  const {
    recipientName,
    recipientNumber,
    description,
    invoiceId,
    referenceId,
    amount,
    serviceProvider,
  } = route?.params;
  console.log('nameeee', route?.params);
  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();

  const { data, isLoading } = useGetReceiptDetails(user.merchant);
  const { data: details, isLoading: isDetailsLoading } = useGetMerchantDetails(
    user.merchant,
  );

  const receiptItem = data && data.data && data.data.data;

  if (isLoading || isDetailsLoading) {
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
          <View collapsable={false} ref={viewRef} style={{ marginTop: 12 }}>
            <Text style={[styles.receipt, { textAlign: 'center' }]}>
              {receiptItem && receiptItem.receipt_header}
            </Text>
            <View style={styles.upper}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 12,
                }}>
                <View style={{ width: '95%' }}>
                  {receiptItem &&
                    receiptItem.receipt_show_business === 'YES' && (
                      <Text style={styles.receipt}>
                        {merchantDetails && merchantDetails.merchant_name}
                      </Text>
                    )}
                  {receiptItem && receiptItem.receipt_show_tin === 'YES' && (
                    <Text style={styles.merchantDetail}>
                      Tin:{' '}
                      {merchantDetails && merchantDetails.merchant_reg_number}
                    </Text>
                  )}
                  {receiptItem &&
                    receiptItem.receipt_show_address === 'YES' && (
                      <Text style={styles.merchantDetail}>
                        {merchantDetails && merchantDetails.merchant_address}
                      </Text>
                    )}
                  {receiptItem && receiptItem.receipt_show_phone === 'YES' && (
                    <Text style={styles.merchantDetail}>
                      Tel: {merchantDetails && merchantDetails.merchant_phone}
                    </Text>
                  )}
                  {receiptItem && receiptItem.receipt_show_email === 'YES' && (
                    <Text style={styles.merchantDetail}>
                      Email: {merchantDetails && merchantDetails.merchant_email}
                    </Text>
                  )}
                </View>
                {receiptItem && receiptItem.receipt_show_logo === 'YES' && (
                  <View
                    style={{
                      marginLeft: 'auto',
                      marginRight: 12,
                      // alignSelf: 'flex-start',
                    }}>
                    <Image
                      style={{ height: 90, width: 90 }}
                      source={{
                        uri: imgUrl,
                      }}
                    />
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  // paddingHorizontal: 12,
                  marginTop: 14,
                  alignItems: 'center',
                }}>
                <View style={{ marginLeft: 12 }}>
                  <Text
                    style={[
                      styles.customerDetails,
                      { fontFamily: 'SFProDisplay-Medium', fontSize: 15 },
                    ]}>
                    RECEIPT #: {invoiceId}
                  </Text>
                  <Text style={styles.customerDetails}>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Medium',
                        fontSize: 15,
                        color: '#30475e',
                      }}>
                      Date & Time:
                    </Text>{' '}
                    {orderDate}
                  </Text>
                  {receiptItem && receiptItem.receipt_show_attendant === 'YES' && (
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'SFProDisplay-Medium',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Served By:
                      </Text>{' '}
                      {user.name}
                    </Text>
                  )}
                  {receiptItem && receiptItem.receipt_show_customer === 'YES' && (
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'SFProDisplay-Medium',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Customer:{' '}
                      </Text>
                      {recipientNumber}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.scanWrapper}>
                <Text style={styles.scan}>Transaction Summary</Text>
              </View>
            </View>
            <View>
              <ReceiptTaxItem taxName="Amount Sent" amount={amount} />
              <ReceiptTaxItem
                taxName="Recipient Name"
                amount={recipientName}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Recipient Number"
                amount={recipientNumber}
                showSymbol={false}
              />
              {/* <ReceiptTaxItem taxName="Commission Earned" amount={commission} /> */}
              <ReceiptTaxItem
                taxName="Invoice ID"
                amount={invoiceId}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Reference ID"
                amount={referenceId}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Service Provider"
                amount={mapPaymentChannelToName[serviceProvider]}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Description"
                amount={description}
                showSymbol={false}
              />
            </View>
            <View>
              {/* <Text style={styles.totalAmount}>
                Total: GHS{' '}
                {cashEntered.length > 0 && quickSaleInAction
                  ? subTotal
                  : totalOtherAmount.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.totalAmount,
                  { marginTop: 0, fontFamily: 'Inter-Medium', fontSize: 16 },
                ]}>
                {mapPaymentChannelToName[paymentChannel]}: GHS{' '}
                {cashEntered.length > 0 && quickSaleInAction
                  ? subTotal
                  : totalOtherAmount.toFixed(2)}
              </Text> */}
              {receiptItem?.receipt_website_url?.length > 0 && (
                <View style={styles.qr}>
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontFamily: 'SFProDisplay-Regular',
                        color: '#5C6E91',
                        textAlign: 'center',
                        marginBottom: 12,
                        fontSize: 15,
                        marginTop: 6,
                      }}>
                      {receiptItem?.receipt_footer}
                    </Text>
                    <QRCode
                      value={receiptItem?.receipt_website_url}
                      size={84}
                    />
                    <Text
                      onPress={() =>
                        Linking.openURL(
                          'https://' + receiptItem?.receipt_website_url,
                        )
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
                      {receiptItem?.receipt_website_url}
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 12,
                    marginBottom: 4,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'SFProDisplay-Regular',
                      color: '#5C6E91',
                      textAlign: 'center',
                    }}>
                    Receipt created using Digistore Business Manager
                  </Text>
                  <Image
                    style={{ height: 20, width: 50, marginLeft: 4 }}
                    resizeMode="contain"
                    source={{
                      uri: 'https://payments.ipaygh.com/app/webroot/img/logo/DSBMLogo.jpg',
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Regular',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginBottom: 14,
                  }}>
                  Download the App or Visit{' '}
                  <Text
                    style={{ color: 'blue' }}
                    onPress={() =>
                      Linking.openURL('https://digistoreafrica.com')
                    }>
                    www.digistoreafrica.com
                  </Text>{' '}
                  to sign up and create professional Receipts
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BillReceiptShareButton
        viewRef={viewRef}
        orderNumber={invoiceId}
        paymentId={invoiceId}
        toggleNotification={toggleNotification}
        setNotificationType={setNotificationType}
        mobileNumber={''}
      />
      {notification && (
        <SendNotification
          notification={notification}
          toggleNotification={toggleNotification}
          navigation={navigation}
          notificationType={notificationType}
          tran_id={invoiceId}
        />
      )}
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
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14,
    color: '#30475e',
  },
  merchantDetail: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#5C6E91',
    fontSize: 14,
    width: '64%',
    marginTop: 3,
  },
  receipt: {
    fontFamily: 'SFProDisplay-Medium',
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
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 15,
  },
  qr: {
    marginVertical: 12,
    // alignItems: 'center',
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
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 18,
    color: '#30475E',
    marginLeft: 'auto',
    marginBottom: 8,
    marginRight: 10,
    marginTop: 12,
  },
});

export default SendMoneyReceipt;
