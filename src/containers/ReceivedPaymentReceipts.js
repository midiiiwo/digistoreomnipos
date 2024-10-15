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
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ReceiptTaxItem from '../components/ReceiptTaxItem';
import { useSelector } from 'react-redux';

import SendNotification from '../components/Modals/SendNotification';
import moment from 'moment';
import BillReceiptShareButton from '../components/BillReceiptShareButton';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';

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
};

// moment()
const orderDate = moment().format('DD-MM-YYYY, h:mm:ss a');

const ReceivedPaymentReceipt = ({ route, navigation }) => {
  const { user, outlet } = useSelector(state => state.auth);

  const viewRef = React.useRef();

  const {
    recipientName,
    recipientNumber,
    description,
    invoiceId,
    referenceId,
    amount,
    serviceProvider,
  } = route && route.params && route.params;

  const [notification, toggleNotification] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState();
  return (
    <>
      <View
        style={{
          backgroundColor: '#EEEEEE',
          paddingHorizontal: Dimensions.get('window').width * 0.3,
          flex: 1,
        }}>
        <ShadowedView
          style={[
            shadowStyle({
              opacity: 0.8,
              radius: 1,
              offset: [0, 0],
            }),
            {
              flex: 1,
              backgroundColor: '#fff',
              marginVertical: 10,
            },
          ]}>
          <ScrollView
            style={styles.wrapper}
            contentContainerStyle={{ paddingVertical: 14 }}>
            <View collapsable={false} ref={viewRef} style={{ marginTop: 12 }}>
              <View style={styles.upper}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 12,
                  }}>
                  <View style={{ width: '95%' }}>
                    <Text style={styles.receipt}>
                      {user && user.user_merchant}
                    </Text>
                    <Text style={styles.merchantDetail}>Tin: C01432532532</Text>
                    <Text style={styles.merchantDetail}>
                      {outlet && outlet.outlet_address}
                    </Text>
                    <Text style={styles.merchantDetail}>
                      Tel: {user.user_merchant_phone}
                    </Text>
                    <Text style={styles.merchantDetail}>
                      Email: {user.user_merchant_email}
                    </Text>
                  </View>
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
                      {orderDate}
                    </Text>
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'Inter-Medium',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Served By:
                      </Text>{' '}
                      {user.name}
                    </Text>
                    <Text style={styles.customerDetails}>
                      <Text
                        style={{
                          fontFamily: 'Inter-Medium',
                          fontSize: 15,
                          color: '#30475e',
                        }}>
                        Customer:{' '}
                      </Text>
                      {recipientNumber}
                    </Text>
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
                  taxName="Payment Method"
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
                      fontFamily: 'Inter-Bold',
                      color: '#5C6E91',
                      textAlign: 'center',
                      marginTop: 12,
                    }}>
                    Powered by Digistore POS
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Inter-Regular',
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
                        fontFamily: 'Inter-Medium',
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
        </ShadowedView>

        {notification && (
          <SendNotification
            notification={notification}
            toggleNotification={toggleNotification}
            navigation={navigation}
            notificationType={notificationType}
            tran_id={invoiceId}
          />
        )}
      </View>
      <BillReceiptShareButton
        viewRef={viewRef}
        orderNumber={invoiceId}
        paymentId={invoiceId}
        toggleNotification={toggleNotification}
        setNotificationType={setNotificationType}
        mobileNumber={''}
      />
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
