/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const SmsItem = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => {
        navigation.navigate('Sms Details', { item });
      }}>
      <View style={styles.details}>
        <View
          style={{
            flexDirection: 'row',
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
              {item?.batch_no}
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
              {moment(item?.transaction_date).format('MMM DD, YYYY')}
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
            marginTop: 'auto',
          }}>
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
            {item?.bill_recipient}
          </Text>
        </View>
      </View>
      <View style={styles.status}>
        <Text style={[styles.count, { textAlign: 'right' }]}>
          GHS {Number(item?.transaction_charge || 0).toFixed(2)}
        </Text>

        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item?.payment_status === 'Successful'
                    ? '#87C4C9'
                    : item?.payment_status === 'Pending'
                    ? '#FFDB89'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item?.payment_status}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SmsItem;

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
