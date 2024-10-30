/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment/moment';

const InvoiceItem = ({ item }) => {
  const navigation = useNavigation();
  const currentDate = moment(new Date());
  const dueDate = moment(item.PAYMENT_DUE_DATE);
  return (
    <Pressable
      style={[
        styles.wrapper,
        { borderBottomColor: '#ddd', borderBottomWidth: 0.5 },
      ]}
      onPress={() => {
        navigation.navigate('Invoice Details', { item, isEstimate: false });
        // navigation.navigate('Order Details', { id: item.order_no });
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
                  fontSize: 16,
                  marginBottom: 0,
                },
              ]}
              numberOfLines={1}>
              INV {item.external_invoice}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'IBMPlexSans-Regular',
                  fontSize: 15,
                  color: '#30475e',
                  marginBottom: 4,
                  opacity: 0.7,
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
                  fontFamily: 'IBMPlexSans-Medium',
                  fontSize: 14,
                  color: '#000',
                  opacity: 0.7,
                  marginTop: 12,
                },
              ]}>
              {dueDate.diff(currentDate, 'days') < 0 &&
              item.PAYMENT_STATUS !== 'Successful'
                ? `Due ${Math.abs(dueDate.diff(currentDate, 'days'))} days ago`
                : moment(new Date(item?.TRANSACTION_DATE)).format(
                    'DD MMM, YYYY',
                  )}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.status}>
        <Text style={[styles.count, { textAlign: 'right' }]}>
          Due GHS{' '}
          {new Intl.NumberFormat().format(Number(item?.BILL_AMOUNT).toFixed(2))}
        </Text>

        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.PAYMENT_STATUS === 'Successful'
                    ? '#87C4C9'
                    : dueDate.diff(currentDate, 'days') < 0
                    ? '#D24545'
                    : item.PAYMENT_STATUS === 'Pending'
                    ? '#F5A25D'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>
            {item.PAYMENT_STATUS === 'Successful'
              ? 'Paid'
              : dueDate.diff(currentDate, 'days') < 0
              ? 'Overdue'
              : item.PAYMENT_STATUS}
          </Text>
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
    color: '#30475e',
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
    paddingVertical: 3.5,
    backgroundColor: '#f9f9f9',
    alignSelf: 'flex-end',
    marginTop: 'auto',
    // position: 'absolute',
    // right: 18,
  },
  name: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#30475e',
    fontSize: 14,
  },
});
