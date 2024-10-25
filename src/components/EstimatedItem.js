/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment/moment';
import { capitalize } from 'lodash';

const EstimateItem = ({ item }) => {
  const navigation = useNavigation();
  const estimateData = JSON.parse(item?.invoice_data);
  console.log('estttt', estimateData);
  return (
    <Pressable
      style={[
        styles.wrapper,
        { borderBottomColor: '#ddd', borderBottomWidth: 0.5 },
      ]}
      onPress={() => {
        navigation.navigate('Invoice Details', {
          item: {
            BILL_AMOUNT: estimateData?.grandTotal,
            CUSTOMER_EMAIL: estimateData?.customer?.email,
            CUSTOMER_NAME: estimateData?.customer?.name,
            CUSTOMER_CONTACTNO: estimateData?.customer?.phone,
            PAYMENT_DUE_DATE: '',

            TRANSACTION_DATE: item?.invoice_create_date,
            PAYMENT_STATUS: item?.invoice_status,
            external_invoice: estimateData?.invoiceNumber,
            order_no: '',
            estimateOrderItemList: estimateData?.cart,
          },
          isEstimate: true,
          estimateData,
          recordNumber: item?.record_no,
        });
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
              EST. {estimateData.invoiceNumber}
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
              {estimateData?.customer?.name?.length > 0
                ? estimateData?.customer?.name
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
              {moment(new Date(item?.invoice_create_date)).format(
                'DD MMM, YYYY',
              )}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.status}>
        <Text style={[styles.count, { textAlign: 'right' }]}>
          Due GHS{' '}
          {new Intl.NumberFormat().format(
            Number(estimateData?.grandTotal).toFixed(2),
          )}
        </Text>

        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item.invoice_status === 'DRAFT'
                    ? '#B5C0D0'
                    : item.invoice_status === 'COMPLETED'
                    ? '#87C4C9'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>
            {capitalize(item.invoice_status)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default EstimateItem;

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
