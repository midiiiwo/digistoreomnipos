/* eslint-disable react-native/no-inline-styles */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Transfer from '../../assets/icons/fundsTransfer.svg';
import Internet from '../../assets/icons/internet';
import SendMoney from '../../assets/icons/send-2';
import Airtime from '../../assets/icons/airtime.svg';
import Bill from '../../assets/icons/bill.svg';
import SMS from '../../assets/icons/sms.svg';
import Expenses from '../../assets/icons/expenses.svg';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const Outflows = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  return (
    <View style={styles.main}>
      <ScrollView>
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-Medium',
              fontSize: 22,
              color: '#002',
            }}>
            Outflows
          </Text>
        </View>
        <Pressable
          style={[styles.item, { borderTopColor: '#ddd', borderTopWidth: 0.4 }]}
          onPress={() => {
            if (
              user &&
              user.user_merchant_agent == '6'
              // !user.user_permissions.includes('VIEWMPAY')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }
            if (user.user_merchant_group !== 'Administrators') {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
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
            navigation.navigate('Funds Transfer');
          }}>
          <Transfer height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Transfer</Text>
            <Text style={styles.caption}>
              Transfers to your bank account or mobile money
            </Text>
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
          <SendMoney height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Send Money</Text>
            <Text style={styles.caption}>View Send money payments history</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('VIEWTOPUP')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }

            if (!user.user_permissions.includes('VIEWTOPUP')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            navigation.navigate('Airtime History');
          }}>
          <Airtime height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Airtime Top-up</Text>
            <Text style={styles.caption}>View prepaid top-up history</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            // navigation.navigate('Funds Transfer');
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('VIEWBILLPAY')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }

            if (!user.user_permissions.includes('VIEWBILLPAY')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            navigation.navigate('Bill History');
          }}>
          <Bill height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Bill Payment</Text>
            <Text style={styles.caption}>View bill payment history</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            // navigation.navigate('Funds Transfer');
            if (
              user &&
              user.user_merchant_agent == '6' &&
              !user.user_permissions.includes('VIEWBILLPAY')
            ) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'No Access',
                textBody:
                  'Service not available on your account. Please contact Ecobank support',
              });
              return;
            }

            if (!user.user_permissions.includes('VIEWBILLPAY')) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: 'Upgrade Needed',
                textBody:
                  "You don't have access to this feature. Please upgrade your account",
              });
              return;
            }
            navigation.navigate('Internet History');
          }}>
          <Internet height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Buy Internet</Text>
            <Text style={styles.caption}>
              View Broadband and Internet payment history
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            navigation.navigate('Expenses');
          }}>
          <Expenses height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>Expenses</Text>
            <Text style={styles.caption}>View expenses history</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            navigation.navigate('Sms History');
          }}>
          <SMS height={30} width={30} />
          <View style={styles.wrapper}>
            <Text style={styles.itemHeader}>SMS</Text>
            <Text style={styles.caption}>View SMS cost history</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Outflows;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemHeader: {
    fontSize: 15,
    color: '#30475e',
    fontFamily: 'ReadexPro-Medium',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: '#ddd',
    paddingHorizontal: 22,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  caption: {
    fontSize: 13,
    color: '#748DA6',
    fontFamily: 'ReadexPro-Regular',
  },
  wrapper: {
    width: '85%',
    marginLeft: 13,
  },
});
