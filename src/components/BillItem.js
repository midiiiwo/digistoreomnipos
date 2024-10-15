/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const bills = {
  DSTV: 'DSTV',
  BO: 'BOX Office',
  GOTV: 'GOTV',
  ECGP: 'ECG Postpaid',
  ECG: 'ECG Prepaid',
  KWESETV: 'Kwese TV',
  MTNPP: 'MTN Postpaid',
  VPP: 'Vodafone Postpaid',
  GWCL: 'Ghana Water Company',
  SURF: 'Surfline 4G',
  ADSL: 'Vodafone Broadband',
  MTNBB: 'MTN Broadband',
  BUSY: 'Busy 4G',
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

const ImageItem = ({ BILL_TYPEID }) => {
  return (
    <View
      style={{
        // backgroundColor: 'orange',
        justifyContent: 'center',
      }}>
      {BILL_TYPEID === 'GOTV' && (
        <Image
          source={require('../../assets/images/gotv.webp')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'ECG' && (
        <Image
          source={require('../../assets/images/ecg.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'ECGP' && (
        <Image
          source={require('../../assets/images/ecg.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'VPP' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'MTNPP' && (
        <Image
          source={require('../../assets/images/mtn-fibre.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'DSTV' && (
        <Image
          source={require('../../assets/images/dstv.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'BO' && (
        <Image
          source={require('../../assets/images/boxoffice.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'GWCL' && (
        <Image
          source={require('../../assets/images/water.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'BUSY' && (
        <Image
          source={require('../../assets/images/busy.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'SURF' && (
        <Image
          source={require('../../assets/images/surfline.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'MTNBB' && (
        <Image
          source={require('../../assets/images/mtn-fibre.png')}
          style={styles.img}
        />
      )}
      {BILL_TYPEID === 'ADSL' && (
        <Image
          source={require('../../assets/images/vodafone-broadband.png')}
          style={styles.img}
        />
      )}
    </View>
  );
};

const BillItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() =>
        navigation.navigate('Bill Receipt', {
          accountNumber: item.BILL_ACCOUNTNO,
          accountName: item.CUSTOMER_NAME,
          amount: item.BILL_AMOUNT,
          transactionId: item.TRANSACTION_ID,
          referenceId: item.ETZ_REFERENCE,
          billName: bills[item.BILL_TYPEID],
          commission: item.BILL_COMMISSION,
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
              {item.TRANSACTION_ID}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 13.7,
                  color: '#6D8299',
                  marginBottom: 4,
                  letterSpacing: 0.2,
                },
              ]}
              numberOfLines={1}>
              {item.BILL_ACCOUNTNO}
            </Text>

            <Text
              style={[
                styles.name,

                {
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 13.8,
                  color: '#6D8299',
                  marginBottom: 12,
                  letterSpacing: 0.2,
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
          <ImageItem BILL_TYPEID={item.BILL_TYPEID} />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'SFProDisplay-Medium',
                fontSize: 13.8,
                letterSpacing: 0.2,
              },
            ]}
            numberOfLines={1}>
            {bills[item.BILL_TYPEID]}
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
          GHS {Number(item.BILL_AMOUNT).toFixed(2)}
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
                  item.TRANSACTION_STATUS === 'Completed'
                    ? '#87C4C9'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item.TRANSACTION_STATUS}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default BillItem;

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
