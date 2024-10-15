/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Pressable, StyleSheet, View, Text, ScrollView } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useSelector } from 'react-redux';
import { useGetSelectedOrderDetails } from '../../hooks/useGetSelectedOrderDetails';
import Loading from '../Loading';

const mapChannelToPayment = {
  VODAC: 'Vodafone Cash',
  MTNMM: 'Mtn Mobile Money',
  TIGOC: 'AirtelTigo',
  CASH: 'Cash',
  VISAG: 'Card',
  UNKNOWN: 'Unknown',
};

function SelectedOrderSheet(props) {
  const { user } = useSelector(state => state.auth);

  const { data, isLoading } = useGetSelectedOrderDetails(
    user.merchant,
    props.payload.id,
  );

  const item = data && data.data && data.data.data;

  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={false}
      containerStyle={[styles.containerStyle]}
      indicatorStyle={styles.indicatorStyle}
      springOffset={0}
      snapPoints={[95]}
      defaultOverlayOpacity={0.3}>
      <ScrollView style={styles.main}>
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <View style={styles.header}>
              <Pressable onPress={() => SheetManager.hide('selectedOrder')}>
                <Text style={styles.done}>Done</Text>
              </Pressable>
            </View>
            <Text style={styles.orderNo}>Order #{item.order_no}</Text>
            <View style={styles.status}>
              <View style={[styles.statusWrapper]}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        item.order_status === 'PAID' ||
                        item.order_status === 'COMPLETED'
                          ? '#87C4C9'
                          : '#FD8A8A',
                    },
                  ]}
                />
                <Text style={styles.orderStatus}>
                  {item.order_status === 'PAID' ||
                  item.order_status === 'COMPLETED'
                    ? 'Paid'
                    : 'Failed'}
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
              <Pressable
                style={styles.changeWrapper}
                onPress={() =>
                  SheetManager.show('orderStatus', { payload: item })
                }>
                <Text style={styles.change}>Update status</Text>
              </Pressable>
            </View>
            <Text style={styles.amount}>GHS {item.total_amount}</Text>
            <Text style={styles.amount}>
              {mapChannelToPayment[item.payment_channel]}
            </Text>
            <Text style={[styles.amount]}>{item.order_date.slice(0, 10)}</Text>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>PAYMENT SUMMARY</Text>
              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Order total</Text>
                <Text style={styles.taxAmount}>GHS {item.order_amount}</Text>
              </View>

              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Processing fee</Text>
                <Text style={styles.taxAmount}>GHS {item.fee_charge}</Text>
              </View>
              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Delivery fee</Text>
                <Text style={styles.taxAmount}>GHS {item.delivery_charge}</Text>
              </View>
              <View style={styles.taxMain}>
                <Text style={styles.taxLabel}>Total</Text>
                <Text style={styles.taxAmount}>GHS {item.total_amount}</Text>
              </View>
            </View>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>CUSTOMER DETAILS</Text>
              <View style={[styles.taxMain, { justifyContent: 'flex-start' }]}>
                <Text style={styles.taxLabel}>
                  {item.customer_name.length > 0
                    ? item.customer_name
                    : 'No name'}
                </Text>
                {/* <Text style={styles.taxAmount}>GHS {200}</Text> */}
              </View>

              <View style={[styles.taxMain, { justifyContent: 'flex-start' }]}>
                <Text style={styles.taxLabel}>
                  {item.customer_contact.length > 0
                    ? item.customer_contact
                    : 'No contact'}
                </Text>
                {/* <Text style={styles.taxAmount}>GHS {200}</Text> */}
              </View>
              <View style={[styles.taxMain, { justifyContent: 'flex-start' }]}>
                <Text style={styles.taxLabel}>
                  {item.customer_email.length > 0
                    ? item.customer_email
                    : 'No email'}
                </Text>
                {/* <Text style={styles.taxAmount}>GHS {200}</Text> */}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28,
    height: '100%',
  },
  done: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
    marginLeft: 'auto',
  },
  header: {
    paddingHorizontal: 4,
    marginBottom: 7,
  },
  orderNo: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#30475E',
  },
  orderStatus: {
    fontFamily: 'Inter-Medium',
    color: '#30475e',
    fontSize: 15,
  },
  statusIndicator: {
    height: 14,
    width: 14,
    borderRadius: 100,
    marginRight: 8,
    backgroundColor: '#87C4C9',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingRight: 18,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  changeWrapper: {
    marginLeft: 'auto',
    marginRight: 14,
  },
  change: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
  },
  status: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    paddingBottom: 12,
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
    color: '#5C6E91',
    fontSize: 14,
    marginTop: 5,
  },
  summary: {
    marginTop: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter-Medium',
    marginTop: 12,
    marginBottom: 5,
    color: '#30475e',
  },
  taxMain: {
    flexDirection: 'row',
    // marginVertical: 6,
    // marginTop: 10,
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    justifyContent: 'center',
  },
  taxLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#5C6E91',
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#5C6E91',
  },
});

export default SelectedOrderSheet;
