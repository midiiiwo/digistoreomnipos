/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

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
          source={require('../../assets/images/AirtelTigo-Money.jpeg')}
          style={styles.img}
        />
      )}
      {PAYMENT_CHANNEL === 'TIGOC' && (
        <Image
          source={require('../../assets/images/AirtelTigo-Money.jpeg')}
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
      {PAYMENT_CHANNEL === 'DEBITBAL' && (
        <Image
          style={[styles.img, { borderRadius: 0 }]}
          source={require('../../assets/images/paylater.png')}
        />
      )}
      {PAYMENT_CHANNEL === 'CREDITBAL' && (
        <Image
          style={[styles.img, { borderRadius: 0 }]}
          source={require('../../assets/images/storecredit.png')}
        />
      )}
    </View>
  );
};

const InvoiceItem = ({ item }) => {
  // const navigation = useNavigation();
  return (
    <Pressable style={styles.wrapper}>
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
                  fontFamily: 'ReadexPro-bold',
                  fontSize: 16,
                  marginBottom: 4,
                },
              ]}
              numberOfLines={1}>
              {item.PAYMENT_INVOICE}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14,
                  color: '#6D8299',
                  marginBottom: 4,
                },
              ]}
              numberOfLines={1}>
              {item.CUSTOMER_NAME.length > 0
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
                },
              ]}>
              {item.TRANSACTION_DATE.slice(0, 16)}
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
          <ImageItem PAYMENT_CHANNEL={item.PAYMENT_CHANNEL} />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'ReadexPro-Medium',
                fontSize: 14,
              },
            ]}
            numberOfLines={1}>
            {mapChannelToName[item.PAYMENT_CHANNEL]}
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
          GHS{' '}
          {new Intl.NumberFormat().format(Number(item.BILL_AMOUNT).toFixed(2))}
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
                  item.PAYMENT_STATUS === 'Successful'
                    ? '#87C4C9'
                    : item.PAYMENT_STATUS === 'Pending'
                    ? '#FFDB89'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item.PAYMENT_STATUS}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default InvoiceItem;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 4,
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
    fontFamily: 'ReadexPro-Medium',
    color: '#6D8299',
    fontSize: 16,
    marginBottom: 6,
    // marginTop: 8,
  },
  status: {
    marginLeft: 'auto',
  },
  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 15,
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
