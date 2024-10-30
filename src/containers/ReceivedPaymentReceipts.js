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

import SendNotification from '../components/Modals/SendNotification';
import BillReceiptShareButton from '../components/BillReceiptShareButton';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';
import Loading from '../components/Loading';
import CornerRibbon from '../components/CornerRibbon';
import { useGetMerchantDetails } from '../hooks/useGetMerchantDetails';

const mapPaymentChannelToName = {
  MTNMM: 'MTN Mobile Money',
  VODAC: 'Vodafone Cash',
  AIRTELM: 'AirtelTigo Money',
  CASH: 'Cash',
  TIGOC: 'AirtelTigo Money',
  DISC: 'Discount',
  UNKNOWN: 'Unknown',
  VISAG: 'Card',
  LPTS: 'Loyalty Points',
  OFFMOMO: 'Offline MoMo',
  OFFCARD: 'Offline Card',
  BANK: 'Bank',
  QRPAY: 'GHQR',
  CREDITBAL: 'Store Credit',
  DEBITBAL: 'Pay Later',
};

// moment()

const ReceivedPaymentReceipt = ({ route, navigation }) => {
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
    date,
    servedBy,
    paymentStatus,
  } = route && route.params && route.params;

  const { data: receiptDetailsData, isLoading: isReceiptDetailsLoading } =
    useGetReceiptDetails(user.merchant);
  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();

  const { data: details, isLoading: isDetailsLoading } = useGetMerchantDetails(
    user.merchant,
  );

  const merchantDetails = details && details.data && details.data.data;

  if (isReceiptDetailsLoading || isDetailsLoading) {
    return <Loading />;
  }

  const receiptItem =
    receiptDetailsData &&
    receiptDetailsData.data &&
    receiptDetailsData.data.data;

  return (
    <>
      <SafeAreaView style={styles.main}>
        <ScrollView style={styles.wrapper}>
          <View collapsable={false} ref={viewRef} style={{ marginTop: 12 }}>
            <View style={{ position: 'absolute', top: -10, right: -10 }}>
              <CornerRibbon color={'red'} status={paymentStatus} />
            </View>
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
                <View style={{ width: '69%' }}>
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
                      Tel:{' '}
                      {merchantDetails &&
                        merchantDetails.merchant_contact_phone}
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
                        uri: user.user_merchant_logo + '?' + cacheBust,
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
                      { fontFamily: 'Inter-SemiBold', fontSize: 15 },
                    ]}>
                    RECEIPT #: {invoiceId}
                  </Text>
                  <Text style={styles.customerDetails}>
                    <Text
                      style={{
                        fontFamily: 'Inter-Medium',
                        fontSize: 15,
                        color: '#30475e',
                      }}>
                      Date & Time:
                    </Text>{' '}
                    {date}
                  </Text>
                  {receiptItem && receiptItem.receipt_show_attendant === 'YES' && (
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'SFProDisplay-Regular',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Served By:
                      </Text>{' '}
                      {servedBy}
                    </Text>
                  )}
                  {receiptItem && receiptItem.receipt_show_customer === 'YES' && (
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'SFProDisplay-Regular',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Customer: {recipientName}{' '}
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
                taxName="Sender Name"
                amount={recipientName}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Sender Number"
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
                taxName="Payment Method"
                amount={mapPaymentChannelToName[serviceProvider]}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Description"
                amount={description}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Payment Status"
                amount={paymentStatus}
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
              {invoiceId && (
                <View style={styles.qr}>
                  <View style={{ marginTop: 14, alignItems: 'center' }}>
                    <QRCode
                      value={invoiceId}
                      size={84}
                      style={{ position: 'absolute' }}
                    />
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
                    fontFamily: 'SFProDisplay-Regular',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginBottom: 12,
                    fontSize: 15,
                    marginTop: 6,
                  }}>
                  {receiptItem && receiptItem.receipt_footer}
                </Text>

                <Text
                  style={{
                    fontFamily: 'Inter-Bold',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginTop: 12,
                  }}>
                  Powered by Digistore
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
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#30475e',
  },
  merchantDetail: {
    fontFamily: 'Inter-Regular',
    color: '#5C6E91',
    fontSize: 14,
    width: '64%',
    marginTop: 3,
  },
  receipt: {
    fontFamily: 'Inter-SemiBold',
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#30475E',
    marginLeft: 'auto',
    marginBottom: 8,
    marginRight: 10,
    marginTop: 12,
  },
});

export default ReceivedPaymentReceipt;
