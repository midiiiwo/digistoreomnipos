/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TicketSolid from '../../assets/icons/ticket-solid.svg';
import moment from 'moment';

const TicketHistoryItem = ({ item }) => {
  return (
    <View style={styles.wrapper}>
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
              {item && item.transaction_id}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 14,
                  color: '#6D8299',
                  marginBottom: 4,
                  opacity: 0.6,
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
                  fontSize: 14,
                  color: '#6D8299',
                  marginBottom: 8,
                  opacity: 0.6,
                },
              ]}>
              {item &&
                item.validated_date &&
                moment(item.validated_date).format('DD-MMM-YYYY H:mm')}
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
          <TicketSolid />
          <Text
            style={[
              styles.name,
              {
                marginLeft: 6,
                fontFamily: 'ReadexPro-Regular',
                fontSize: 14.2,
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
        <View style={[styles.statusWrapper]}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  item && item.ticket_usage === 'Passed'
                    ? '#87C4C9'
                    : '#FD8A8A',
              },
            ]}
          />
          <Text style={styles.orderStatus}>{item && item.ticket_usage}</Text>
        </View>
      </View>
    </View>
  );
};

export default TicketHistoryItem;

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
    fontFamily: 'ReadexPro-Regular',
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
