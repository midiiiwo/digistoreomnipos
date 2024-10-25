/* eslint-disable react-native/no-inline-styles */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCheckInvoiceStatus } from '../hooks/useCheckInvoiceStatus';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';

const momoPayments = ['MTN', 'AirtelTigo', 'Vodafone'];

const TicketSoldItem = ({ item }) => {
  const navigation = useNavigation();
  const [currentTransaction, setCurrentTransaction] = React.useState();
  const client = useQueryClient();

  const toast = useToast();

  const { mutate, isLoading } = useCheckInvoiceStatus(i => {
    if (i) {
      toast.show(i.message, { placement: 'top' });
      client.invalidateQueries('merchant-sold-tickets');
    }
  });

  const { user } = useSelector(state => state.auth);

  const isCheckable =
    momoPayments.includes(item.payment_channel) &&
    item.payment_status === 'Pending';

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Ticket Sold Details', {
          item: item || {},
        })
      }
      style={styles.wrapper}>
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
                  fontSize: 15,
                  marginBottom: 4,
                  letterSpacing: 0.3,
                },
              ]}
              numberOfLines={1}>
              {item && item.transaction_id}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14,
                  color: '#6D8299',
                  marginBottom: 14,
                  opacity: 0.7,
                },
              ]}
              numberOfLines={1}>
              {item &&
              item.ticket_customer_name &&
              item.ticket_customer_name.length > 0
                ? item.ticket_customer_name
                : 'No Customer'}
            </Text>
            <Text
              style={[
                styles.name,

                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 13,
                  color: '#6D8299',
                  marginBottom: 12,
                  opacity: 0.7,
                },
              ]}>
              {item && item.transaction_date}
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
          {/* <TicketSolid /> */}
          <Text
            style={[
              styles.name,
              {
                fontFamily: 'ReadexPro-Regular',
                fontSize: 13.5,
                opacity: 0.9,
                letterSpacing: 0.2,
                maxWidth: '90%',
              },
            ]}
            numberOfLines={2}>
            {item && item.event_name}
          </Text>
        </View>
      </View>

      <View style={styles.status}>
        <Text style={[styles.count, { textAlign: 'right' }]}>
          {item && item.ticket_name}
        </Text>
        {isCheckable && (
          <Pressable
            onPress={() => {
              if (item) {
                setCurrentTransaction(item);
                mutate({
                  merchant: user.merchant,
                  invoice: item.transaction_id,
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
                fontSize: 14.5,
                fontFamily: 'ReadexPro-Medium',
                color: '#7091F5',
              }}>
              {isLoading &&
              currentTransaction &&
              currentTransaction.transaction_id === item.transaction_id
                ? 'Loading'
                : 'Check Status'}
            </Text>
          </Pressable>
        )}
        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item && item.payment_status === 'Successful'
                    ? '#87C4C9'
                    : item.payment_status === 'Pending'
                    ? '#F3B664'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item && item.payment_status}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default TicketSoldItem;

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
    fontFamily: 'ReadexPro-Medium',
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
    paddingVertical: 3,
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
