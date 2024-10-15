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
import { FlatList } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';

import Shield from '../../assets/icons/shield.svg';
import ReceiptItem from '../components/ReceiptItem';
import ShareReceiptButton from '../components/ShareReceiptButton';
import ReceiptTaxItem from '../components/ReceiptTaxItem';
import { useSelector } from 'react-redux';

import { useGetApplicableTaxes } from '../hooks/useGetApplicableTaxes';
import Loading from '../components/Loading';
import { useQueryClient } from 'react-query';
import SendNotification from '../components/Modals/SendNotification';
import moment from 'moment';
import BillReceiptShareButton from '../components/BillReceiptShareButton';
import { useGetReceiptDetails } from '../hooks/useGetReceiptDetails';

const mapPaymentChannelToName = {
  mtn: 'Mtn Mobile Money',
  vodafone: 'Vodafone Cash',
  airtelTigo: 'AirtelTigo Money',
  cash: 'Cash',
};

// moment()
const orderDate = moment().format('DD-MM-YYYY, h:mm:ss a');

const BillReceipt = ({ route, navigation }) => {
  const { user, outlet } = useSelector(state => state.auth);

  const viewRef = React.useRef();

  const {
    accountName,
    accountNumber,
    billName,
    transactionId,
    referenceId,
    commission,
    amount,
    mobileNumber,
  } = route && route.params && route.params;

  const { data, isLoading } = useGetReceiptDetails(user.merchant);

  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();

  console.log(mobileNumber);
  if (isLoading) {
    return <Loading />;
  }

  const receiptItem = data && data.data && data.data.data;

  return (
    <>
      <SafeAreaView style={styles.main}>
        <ScrollView style={styles.wrapper}>
          <Text style={[styles.receipt, { textAlign: 'center' }]}>
            {receiptItem && receiptItem.receipt_header}
          </Text>
          <View collapsable={false} ref={viewRef} style={{ marginTop: 12 }}>
            <View style={styles.upper}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 12,
                }}>
                <View style={{ width: '79%' }}>
                  {receiptItem &&
                    receiptItem.receipt_show_business === 'YES' && (
                      <Text style={styles.receipt}>
                        {user && user.user_merchant}
                      </Text>
                    )}
                  {receiptItem && receiptItem.receipt_show_tin === 'YES' && (
                    <Text style={styles.merchantDetail}>Tin: C01432532532</Text>
                  )}
                  {receiptItem &&
                    receiptItem.receipt_show_address === 'YES' && (
                      <Text style={styles.merchantDetail}>
                        {outlet && outlet.outlet_address}
                      </Text>
                    )}
                  {receiptItem && receiptItem.receipt_show_phone === 'YES' && (
                    <Text style={styles.merchantDetail}>
                      Tel: {user.user_merchant_phone}
                    </Text>
                  )}
                  {receiptItem && receiptItem.receipt_show_email === 'YES' && (
                    <Text style={styles.merchantDetail}>
                      Email: {user.user_merchant_email}
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
                      source={{ uri: user.user_merchant_logo }}
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
                    RECEIPT #: {transactionId}
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
                      {mobileNumber}
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
                taxName="Account Name"
                amount={accountName}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Account Number"
                amount={accountNumber}
                showSymbol={false}
              />
              {/* <ReceiptTaxItem taxName="Commission Earned" amount={commission} /> */}
              <ReceiptTaxItem
                taxName="Transaction ID"
                amount={transactionId}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Reference ID"
                amount={referenceId}
                showSymbol={false}
              />
              <ReceiptTaxItem
                taxName="Service Provider"
                amount={billName}
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
              {transactionId && (
                <View style={styles.qr}>
                  <View style={{ marginTop: 14, alignItems: 'center' }}>
                    <QRCode
                      value={transactionId}
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
                    fontFamily: 'SFProDisplay-Semibold',
                    color: '#5C6E91',
                    textAlign: 'center',
                    marginTop: 12,
                  }}>
                  Powered by Digistore POS
                </Text>
                <Text
                  style={{
                    fontFamily: 'SFProDisplay-Regular',
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
                      fontFamily: 'SFProDisplay-Regular',
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
      <BillReceiptShareButton
        viewRef={viewRef}
        orderNumber={transactionId}
        paymentId={transactionId}
        toggleNotification={toggleNotification}
        setNotificationType={setNotificationType}
        mobileNumber={mobileNumber}
      />
      {notification && (
        <SendNotification
          notification={notification}
          toggleNotification={toggleNotification}
          navigation={navigation}
          notificationType={notificationType}
          tran_id={transactionId}
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

export default BillReceipt;
