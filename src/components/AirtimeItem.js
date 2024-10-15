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

const ImageItem = ({ topup_network }) => {
  return (
    <View
      style={{
        // backgroundColor: 'orange',
        justifyContent: 'center',
      }}>
      {topup_network === 'MTN' && (
        <Image
          source={require('../../assets/images/mtn-fibre.png')}
          style={styles.img}
        />
      )}
      {topup_network === 'VODAFONE' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
      {topup_network === 'AIRTEL' && (
        <Image
          source={require('../../assets/images/airteltigo.png')}
          style={styles.img}
        />
      )}
      {topup_network === 'TIGO' && (
        <Image
          source={require('../../assets/images/airteltigo.png')}
          style={styles.img}
        />
      )}
      {topup_network === 'GLO' && (
        <Image
          source={require('../../assets/images/glo.webp')}
          style={styles.img}
        />
      )}
    </View>
  );
};

const AirtelItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() =>
        navigation.navigate('Airtime Receipt', {
          recipientNumber: item.topup_number,
          amount: item.topup_amount,
          transactionId: item.transaction_id,
          referenceId: item.etz_reference,
          serviceProvider: item.topup_network,
        })
      }>
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
                  fontFamily: 'SFProDisplay-Semibold',
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
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 13.7,
                  color: '#6D8299',
                  marginBottom: 4,
                },
              ]}
              numberOfLines={1}>
              {item.topup_number}
            </Text>

            <Text
              style={[
                styles.name,

                {
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 13.4,
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
          <ImageItem topup_network={item.topup_network} />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 14.3,
              },
            ]}
            numberOfLines={1}>
            {item.topup_network}
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
          GHS {Number(item.topup_amount).toFixed(2)}
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
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>
            {item.transfer_status === 'INVALID'
              ? 'CANCELLED'
              : item.topup_status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default AirtelItem;

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 14,
    // paddingTop: 12,
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 2,
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
