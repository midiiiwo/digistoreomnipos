/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React from 'react';

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
          source={require('../../assets/images/credit-card1.png')}
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
    </View>
  );
};

const SendMoneyItem = ({ item }) => {
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
                  fontSize: 15,
                  marginBottom: 4,
                  letterSpacing: 0.2,
                },
              ]}
              numberOfLines={1}>
              {item.transaction_id}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14.3,
                  color: '#6D8299',
                  marginBottom: 4,
                },
              ]}
              numberOfLines={1}>
              {item.customer_name.length > 0
                ? item.customer_name
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
              {item.transaction_date.slice(0, 16)}
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
          <ImageItem PAYMENT_CHANNEL={item.payment_channel} />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'ReadexPro-Medium',
                fontSize: 14.3,
                letterSpacing: 0.2,
                opacity: 0.9,
              },
            ]}
            numberOfLines={1}>
            {mapChannelToName[item.payment_channel]}
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
          GHS {Number(item.bill_amount).toFixed(2)}
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
                  item.transaction_status === 'Completed'
                    ? '#87C4C9'
                    : item.transfer_status === 'Pending'
                    ? '#FFDB89'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item.transaction_status}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SendMoneyItem;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
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
    fontFamily: 'Lato-Bold',
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
