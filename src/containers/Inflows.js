/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
// import SalesIcon from '../../assets/icons/tag';
// import Transfer from '../../assets/icons/fundsTransfer.svg';
// import Internet from '../../assets/icons/internet';
import SendMoney from '../../assets/icons/send-2.svg';
import ReceiveMoney from '../../assets/icons/wallet-3.svg';
import Invoice from '../../assets/icons/invoice.svg';
// import Ticket from '../../assets/icons/ticket.svg';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { ScrollView } from 'react-native';

const Inflows = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  return (
    <View style={styles.main}>
      <ScrollView>
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-bold',
              fontSize: 22,
              color: '#002',
            }}>
            Transaction History
          </Text>
        </View>
        <Pressable
          style={[styles.item, { borderTopColor: '#ddd', borderTopWidth: 0.4 }]}
          onPress={() => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('VIEWMPAY')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }

            if (!user.user_permissions.includes('VIEWMPAY')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            navigation.navigate('Sales History');
          }}>
          <ReceiveMoney height={35} width={35} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Received Payments</Text>
            <Text style={styles.caption}>History of Payments</Text>
          </View>
        </Pressable>
        {/* <Pressable
          style={styles.item}
          onPress={() => {
            navigation.navigate('Invoice History');
          }}>
          <Invoice height={35} width={35} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Invoices</Text>
            <Text style={styles.caption}>History of Invoices</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('VIEWSPAY')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }

            if (!user.user_permissions.includes('VIEWSPAY')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            navigation.navigate('Send Money History');
          }}>
          <SendMoney height={35} width={35} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Send Money</Text>
            <Text style={styles.caption}>View Send money payments history</Text>
          </View>
        </Pressable> */}
        {/* <View style={styles.item}>
        <PaymentsIcon height={35} width={35} />
        <View style={{ marginLeft: 18 }}>
          <Text style={styles.itemHeader}>Payments</Text>
          <Text style={styles.caption}>
            History of Send Money, Airtime, Bills, Internet Payment
          </Text>
        </View>
      </View> */}
      </ScrollView>
    </View>
  );
};

export default Inflows;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemHeader: {
    fontSize: 16,
    color: '#30475e',
    fontFamily: 'ReadexPro-bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: '#ddd',
    paddingHorizontal: 22,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  caption: {
    fontSize: 13.5,
    color: '#748DA6',
    fontFamily: 'ReadexPro-Regular',
  },
  wrapper: {
    width: '85%',
    marginLeft: 13,
  },
});
