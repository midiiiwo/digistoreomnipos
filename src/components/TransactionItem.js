/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { useCheckInvoiceStatus } from '../hooks/useCheckInvoiceStatus';
import { useSelector } from 'react-redux';

const mapChannelToName = {
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
  PATPAY: 'Partial Payment',
  PAYLATER: 'Pay Later',
};

// const mapSalesChannelToName = {
//   INSHOP: 'In-shop',
//   INSHP: 'In-shop',
//   ONLINE: 'Online Store',
//   SNAPCHAT: 'Snapchat',
//   INSTAGRAM: 'Instagram',
//   TWITTER: 'Twitter',
//   WHATSAPP: 'Whatsapp',
//   TIKTOK: 'Tiktok',
//   FACEBOOK: 'Facebook',
//   'WEB POS': 'Web POS',
//   OTHERS: 'Others',
//   MOBILE: 'Mobile',
// };

const ImageItem = ({ PAYMENT_CHANNEL }) => {
  return (
    <View
      style={{
        // backgroundColor: 'orange',
        justifyContent: 'center',
      }}>
      {PAYMENT_CHANNEL === 'MTNMM' && (
        <Image
          source={require('../../assets/images/mtn-momo.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'LPTS' && (
        <Image
          source={require('../../assets/images/present-box.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'VODAC' && (
        <Image
          source={require('../../assets/images/voda-cash.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'AIRTELM' && (
        <Image
          source={require('../../assets/images/atmoney.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'TIGOC' && (
        <Image
          source={require('../../assets/images/atmoney.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'UNKNOWN' && (
        <Image
          source={require('../../assets/images/payment.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'DISC' && (
        <Image
          source={require('../../assets/images/sale.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'CASH' && (
        <Image
          source={require('../../assets/images/cash1.jpeg')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'VISAG' && (
        <Image
          source={require('../../assets/images/credit-card.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'OFFMOMO' && (
        <Image
          source={require('../../assets/images/offline-momo.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'OFFCARD' && (
        <Image
          source={require('../../assets/images/no-wifi.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'BANK' && (
        <Image
          source={require('../../assets/images/saving.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'QRPAY' && (
        <Image
          source={require('../../assets/images/qrnew.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'CREDITBAL' && (
        <Image
          source={require('../../assets/images/storecredit.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'DEBITBAL' && (
        <Image
          source={require('../../assets/images/paylater.png')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'PAYLATER' && (
        <Image
          source={require('../../assets/images/pl.png')}
          style={[styles.img, { borderRadius: 0 }]}
        />
      )}
    </View>
  );
};

const momoPayments = ['MTNMM', 'TIGOC', 'VODAC'];

const TransactionItem = ({ item }) => {
  const toast = useToast();
  const { mutate, isLoading } = useCheckInvoiceStatus(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
    }
  });

  const isCheckable =
    momoPayments.includes(item.PAYMENT_CHANNEL) &&
    item.PAYMENT_STATUS === 'Pending';
  console.log(item.PAYMENT_CHANNEL);
  const { user } = useSelector(state => state.auth);
  const [currentTransaction, setCurrentTransaction] = React.useState();
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => {
        if (item && item.PAYMENT_STATUS !== 'Successful') {
          return;
        }
        navigation.navigate('Received Payment Receipt', {
          recipientName: item.CUSTOMER_NAME,
          recipientNumber: item.PAYMENT_NUMBER,
          amount: item.BILL_AMOUNT,
          invoiceId: item.TRANSACTION_ID,
          referenceId: item.PAYMENT_REFERENCE,
          serviceProvider: item.PAYMENT_CHANNEL,
          // commission: COMMISSION,
          description: item.PAYMENT_DESCRIPTION,
          date: item.TRANSACTION_DATE,
          servedBy: item.MOD_BY_NAME,
          paymentStatus: item.PAYMENT_STATUS,
        });
      }}>
      <View style={styles.details}>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            // alignItems: 'center',
          }}>
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Medium',
                  fontSize: 15.4,
                  marginBottom: 4,
                  letterSpacing: 0.3,
                },
              ]}
              numberOfLines={1}>
              {item && item.TRANSACTION_ID}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14.3,
                  color: '#6D8299',
                  marginBottom: 4,
                  opacity: 0.7,
                },
              ]}
              numberOfLines={1}>
              {item && item.CUSTOMER_NAME && item.CUSTOMER_NAME.length > 0
                ? item.CUSTOMER_NAME
                : 'No Customer'}
            </Text>

            <Text
              style={[
                styles.name,

                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14,
                  color: '#6D8299',
                  marginBottom: 12,
                  opacity: 0.7,
                },
              ]}>
              {item &&
                item.TRANSACTION_DATE &&
                item.TRANSACTION_DATE.slice(0, 16)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'red',
            marginTop: 'auto',
          }}>
          <ImageItem PAYMENT_CHANNEL={item && item.PAYMENT_CHANNEL} />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'ReadexPro-Medium',
                fontSize: 14.2,
                opacity: 0.9,
                letterSpacing: 0.2,
              },
            ]}
            numberOfLines={1}>
            {mapChannelToName[(item && item.PAYMENT_CHANNEL) || '']}
          </Text>
        </View>

        {/* <View style={{ marginTop: 'auto' }}>
          {item.customer_name.length > 0 && (
            <Text
              style={[
                styles.name,
                { fontSize: 15, fontFamily: 'SFProDisplay-Medium' },
              ]}
              numberOfLines={1}>
              {item.customer_name}
            </Text>
          )}
        </View> */}
      </View>
      <View style={styles.status}>
        <Text style={[styles.count, { textAlign: 'right' }]}>
          GHS {Number((item && item.BILL_AMOUNT) || 0).toFixed(2)}
        </Text>
        {/* <View style={[styles.statusWrapper, { alignSelf: 'flex-end' }]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.order_status !== 'NEW' &&
                  item.order_status !== 'PENDING' &&
                  item.order_status !== 'FAILED' &&
                  item.order_status !== 'PAYMENT_CANCELLED' &&
                  item.order_status !== 'PAYMENT_FAILED'
                    ? '#87C4C9'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>
            {item.order_status !== 'NEW' &&
            item.order_status !== 'PENDING' &&
            item.order_status !== 'FAILED' &&
            item.order_status !== 'PAYMENT_CANCELLED' &&
            item.order_status !== 'PAYMENT_FAILED'
              ? 'Paid'
              : 'Unpaid'}
          </Text>
        </View> */}
        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item && item.PAYMENT_STATUS === 'Successful'
                    ? '#87C4C9'
                    : item.PAYMENT_STATUS === 'Pending'
                    ? '#FFDB89'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item && item.PAYMENT_STATUS}</Text>
        </View>
        {isCheckable && (
          <Pressable
            onPress={() => {
              if (item) {
                setCurrentTransaction(item);
                mutate({
                  merchant: user.merchant,
                  invoice: item.TRANSACTION_ID,
                  action: 'check_invoice_status',
                });
              }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 6,
              paddingVertical: 7,
              borderRadius: 4,
              marginTop: 'auto',
              // alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'ReadexPro-Medium',
                color: '#7091F5',
              }}>
              {isLoading &&
              currentTransaction &&
              currentTransaction.TRANSACTION_ID === item.TRANSACTION_ID
                ? 'Loading'
                : 'Check Status'}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 3,
    paddingHorizontal: 12,
    borderRadius: 6,
    // alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
    marginTop: 6,
  },
  details: {
    maxWidth: '70%',
  },
  count: {
    fontFamily: 'Lato-Bold',
    color: '#6D8299',
    fontSize: 15,
    marginBottom: 6,
    // marginTop: 8,
  },
  status: {
    marginLeft: 'auto',
  },
  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
  },
  statusIndicator: {
    height: 8,
    width: 8,
    borderRadius: 100,
    marginRight: 4,
  },
  img: {
    height: 24,
    width: 24,
    borderRadius: 28,
    // marginVertical: 6,
    // marginTop: 6,
    // marginRight: 10,
    // alignSelf: 'flex-start',
    // backgroundColor: 'green',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingRight: 14,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    alignSelf: 'flex-end',
    marginTop: 'auto',
    // position: 'absolute',
    // right: 18,
  },
  name: {
    fontFamily: 'Lato-Bold',
    color: '#30475e',
    // marginBottom: 0,
    fontSize: 15,
  },
});
