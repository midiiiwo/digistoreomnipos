/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { useToast } from 'react-native-toast-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TicketSoldDetails(props) {
  const { item } = props.route.params;

  const ref = React.useRef();

  const {
    event_name,
    payment_channel,
    ticket_customer_email,
    ticket_customer_name,
    ticket_customer_phone,
    ticket_name,
    ticket_venue,
    transaction_date,
    transaction_id,
    ticket_amount,
    payment_status,
  } = item || {};

  const toast = useToast();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: top }}>
      <ScrollView
        style={styles.main}
        contentContainerStyle={{ paddingBottom: 14 + bottom }}>
        <View style={styles.summary} ref={ref}>
          <Text style={styles.summaryLabel}>
            TICKET DETAILS - {ticket_name && ticket_name.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.summaryLabel,
              {
                marginBottom: 16,
                color: '#567189',
                fontFamily: 'ReadexPro-Regular',
              },
            ]}>
            {event_name}
          </Text>
          <View style={styles.status}>
            <View style={[styles.statusWrapper]}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      payment_status === 'Successful'
                        ? '#87C4C9'
                        : payment_status === 'Pending'
                        ? '#F3B664'
                        : '#FD8A8A',
                  },
                ]}
              />
              <Text style={styles.orderStatus}>{payment_status}</Text>
            </View>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Transaction Date</Text>
            <Text style={styles.taxAmount}>{transaction_date}</Text>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Transaction ID</Text>
            <Text style={styles.taxAmount}>{transaction_id}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Ticket Name</Text>
            <Text style={styles.taxAmount}>{ticket_name}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Ticket Price</Text>
            <Text style={styles.taxAmount}>GHS {ticket_amount}</Text>
          </View>

          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Customer Name</Text>
            <Text style={styles.taxAmount}>{ticket_customer_name}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Customer Email</Text>
            <Text style={styles.taxAmount}>{ticket_customer_email}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Customer Phone</Text>
            <Text style={[styles.taxAmount]}>{ticket_customer_phone}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Venue</Text>
            <Text style={styles.taxAmount}>{ticket_venue}</Text>
          </View>
          <View style={styles.taxMain}>
            <Text style={styles.taxLabel}>Payment Channel</Text>
            <Text style={styles.taxAmount}>{payment_channel}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          style={[styles.btn, { flex: 1, backgroundColor: '#30475e' }]}
          handlePress={() => {
            captureRef(ref, {
              format: 'png',
              result: 'base64',
            }).then(async uri => {
              try {
                const res = await Share.open(
                  {
                    title: 'Share receipt',
                    url: 'data:image/png;base64,' + uri,
                  },
                  {},
                );
                if (res.success) {
                  toast.show('Share success');
                }
              } catch (error) {
                // toast.show('Share unsuccessfu');
              }
            });
          }}>
          Share Details
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    width: '100%',
    // paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 28,
    height: '100%',
  },
  indicatorStyle: {
    display: 'none',
  },
  done: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(25, 66, 216, 0.9)',
    marginLeft: 'auto',
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 7,
  },
  orderNo: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    color: '#30475E',
  },
  orderStatus: {
    fontFamily: 'ReadexPro-Medium',
    color: '#30475e',
    fontSize: 14,
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
    marginVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  summaryLabel: {
    fontFamily: 'ReadexPro-Medium',
    marginBottom: 8,
    color: '#30475e',
    fontSize: 15,
  },
  taxMain: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopColor: '#eee',
    borderTopWidth: 0.6,
    justifyContent: 'center',
  },
  taxLabel: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    letterSpacing: 0.3,
    color: '#30475e',
  },
  taxAmount: {
    marginLeft: 'auto',
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    letterSpacing: 0.3,
    color: '#30475e',
    maxWidth: '55%',
    textAlign: 'right',
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  btn: {
    borderRadius: 4,
    // width: '90%',
  },
});

export default TicketSoldDetails;
