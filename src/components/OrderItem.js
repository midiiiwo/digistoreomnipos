/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React from 'react';

const mapChannelToPayment = {
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
  PAYLATER: 'Pay Later',
  STORECREDIT: 'Store Credit',
  BANK: 'Bank',
  QRPAY: 'GHQR',
  CREDITBAL: 'Store Credit',
  DEBITBAL: 'Pay Later',
  INVOICE: 'Invoice',
  NEW: 'Unknown',
  OFFLINE: 'Ussd Offline',
};

const mapSalesChannelToName = {
  INSHOP: 'In-shop',
  INSHP: 'In-shop',
  'IN SHOP': 'In-shop',
  ONLINE: 'Online Store',
  'ONLINE STORE': 'Online Store',
  SNAPCHAT: 'Snapchat',
  INSTAGRAM: 'Instagram',
  TWITTER: 'Twitter',
  WHATSAPP: 'Whatsapp',
  TIKTOK: 'Tiktok',
  FACEBOOK: 'Facebook',
  'WEB POS': 'Web POS',
  OTHERS: 'Others',
  MOBILE: 'Starbite Android',
  IOSMOBILE: 'Starbite IOS',
  'ANDROID APP': 'Starbite Android',
  'IOS APP': 'Starbite IOS',
  GLOVO: 'Glovo',
  BOLT: 'Bolt',
};

const ImageItem = ({ order_source }) => {
  return (
    <View
      style={{
        // backgroundColor: 'orange',
        justifyContent: 'center',
      }}>
      {(order_source === 'INSHOP' || order_source === 'IN SHOP') && (
        <Image
          source={require('../../assets/images/online-store.png')}
          style={styles.img}
        />
      )}
      {order_source === 'INSHP' && (
        <Image
          source={require('../../assets/images/online-store.png')}
          style={styles.img}
        />
      )}

      {(order_source === 'ONLINE' || order_source === 'ONLINE STORE') && (
        <Image
          source={require('../../assets/images/internet-browser.png')}
          style={styles.img}
        />
      )}
      {order_source === 'MOBILE' && (
        <Image
          source={require('../../assets/images/mobile.png')}
          style={styles.img}
        />
      )}
      {order_source === 'WEB POS' && (
        <Image
          source={require('../../assets/images/computer.png')}
          style={styles.img}
        />
      )}
      {order_source === 'SNAPCHAT' && (
        <Image
          source={require('../../assets/images/snapchat.webp')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
      {order_source === 'INSTAGRAM' && (
        <Image
          source={require('../../assets/images/instagram.png')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
      {order_source === 'TWITTER' && (
        <Image
          source={require('../../assets/images/twitter.png')}
          style={styles.img}
        />
      )}
      {order_source === 'WHATSAPP' && (
        <Image
          source={require('../../assets/images/whatsapp.webp')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
      {order_source === 'TIKTOK' && (
        <Image
          source={require('../../assets/images/tik-tok.png')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
      {order_source === 'FACEBOOK' && (
        <Image
          source={require('../../assets/images/facebook.png')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
      {order_source === 'OTHERS' && (
        <Image
          source={require('../../assets/images/sale.png')}
          style={styles.img}
        />
      )}
      {order_source === 'UNKNOWN' && (
        <Image
          source={require('../../assets/images/payment.png')}
          style={styles.img}
        />
      )}
      {order_source === 'IOSMOBILE' && (
        <Image
          source={require('../../assets/images/iphone.png')}
          style={styles.img}
        />
      )}
      {order_source === 'IOS APP' && (
        <Image
          source={require('../../assets/images/iphone.png')}
          style={styles.img}
        />
      )}
      {order_source === 'ANDROID APP' && (
        <Image
          source={require('../../assets/images/mobile.png')}
          style={styles.img}
        />
      )}
      {order_source === 'GLOVO' && (
        <Image
          source={require('../../assets/images/glovo2.png')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
      {order_source === 'BOLT' && (
        <Image
          source={require('../../assets/images/bolt.png')}
          style={[styles.img, { borderRadius: 100 }]}
        />
      )}
    </View>
  );
};

const OrderItem = ({ item, navigation }) => {
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => {
        navigation.navigate('Order Details', { id: item.order_no });
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
                  fontSize: 15.5,
                  marginBottom: 7,
                },
              ]}
              numberOfLines={1}>
              Order #{item.order_no}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 13,
                  color: '#9DB2BF',
                  marginBottom: 3,
                },
              ]}
              numberOfLines={1}>
              {mapChannelToPayment[item.payment_channel]}
            </Text>

            <Text
              style={[
                styles.name,

                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 13,
                  color: '#9DB2BF',
                  marginBottom: 12,
                },
              ]}>
              {item.order_date.slice(0, 16)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 'auto',
          }}>
          <ImageItem order_source={item.order_source} />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'ReadexPro-Regular',
                fontSize: 14,
                letterSpacing: 0.2,
              },
            ]}
            numberOfLines={1}>
            {mapSalesChannelToName[item.order_source]}
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
          <Text style={{ fontSize: 12 }}>GHS</Text>{' '}
          {Number(item.total_amount) == 0 && Number(item.order_discount) != 0
            ? new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Math.abs(Number(item.order_discount)))
            : new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(item.total_amount))}
        </Text>
        <View style={[styles.statusWrapper, { alignSelf: 'flex-end' }]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.order_status !== 'NEW' &&
                  item.order_status !== 'PENDING' &&
                  item.order_status !== 'FAILED' &&
                  item.order_status !== 'PAYMENT_CANCELLED' &&
                  item.order_status !== 'DECLINED' &&
                  item.order_status !== 'PAYMENT_FAILED' &&
                  item.order_status !== 'VOID' &&
                  item.order_status !== 'PAYMENT_DEFERRED' &&
                  item?.payment_status !== 'Deferred'
                    ? '#87C4C9'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>
            {item &&
            item.order_status !== 'NEW' &&
            item.order_status !== 'PENDING' &&
            item.order_status !== 'FAILED' &&
            item.order_status !== 'PAYMENT_CANCELLED' &&
            item.order_status !== 'DECLINED' &&
            item.order_status !== 'PAYMENT_FAILED' &&
            item.order_status !== 'CANCELLED' &&
            item.order_status !== 'PAYMENT_DEFERRED' &&
            item?.payment_status !== 'Deferred'
              ? item.order_status === 'VOID'
                ? 'Void'
                : 'Paid'
              : 'Unpaid'}
          </Text>
        </View>
        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.delivery_status === 'DELIVERED'
                    ? '#87C4C9'
                    : item.delivery_status === 'PENDING'
                    ? '#FD8A8A'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>
            {item.delivery_status === 'DELIVERED'
              ? 'Delivered'
              : item.delivery_status === 'PENDING'
              ? 'Undelivered'
              : 'Undelivered'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 4,
    paddingHorizontal: 14,
    borderRadius: 6,
    paddingRight: 12,
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
    color: '#2D4356',
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
    borderRadius: 4,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingRight: 8,
    paddingVertical: 4,
    backgroundColor: '#f9f9f9',
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  name: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 15,
  },
});
