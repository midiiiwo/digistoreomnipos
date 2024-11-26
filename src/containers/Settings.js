/* eslint-disable react-native/no-inline-styles */
import { Text, View, Pressable, ScrollView } from 'react-native';
import Store from '../../assets/icons/store.svg';
import Taxes from '../../assets/icons/tax.svg';
import Caret from '../../assets/icons/cart-right.svg';
import Discount from '../../assets/icons/Discount.svg'
import Users_ from '../../assets/icons/users_';
// import Delivery from '../../assets/icons/delivery-icon.svg';
import SalesChannel from '../../assets/icons/saleschannel';
import UserSingle from '../../assets/icons/user-single';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Alert from '../../assets/icons/notifications-icon.svg';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

export const SettingsItem = ({ title, Icon, handlePress, extraStyles }) => {
  return (
    <Pressable
      onPress={handlePress}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {Icon && (
        <Icon
          height={17}
          width={17}
          stroke="#002"
          style={{ marginRight: 13 }}
        />
      )}
      <Text
        style={{
          fontFamily: 'ReadexPro-Regular',
          color: '#002',
          fontSize: 14.8,
        }}>
        {title}
      </Text>
      <View style={{ marginLeft: 'auto' }}>
        <Caret height={13} width={13} />
      </View>
    </Pressable>
  );
};

const Settings = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  return (
    <ScrollView style={{ backgroundColor: '#F7F8FA' }}>
      <View>
        <View style={{ paddingHorizontal: 17, marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              fontSize: 26,
              color: '#002',
            }}>
            Settings
          </Text>
        </View>
        <View style={{ paddingHorizontal: 17, marginBottom: 18 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 13,
              borderColor: '#eee',
              borderWidth: 0.4,
            }}>
            <SettingsItem
              title="My Account"
              Icon={UserSingle}
              handlePress={() => navigation.navigate('Account')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Users"
              Icon={Users_}
              handlePress={() => {
                if (!user.user_permissions.includes('MGUSSD')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Manage Users');
              }}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            {/* <SettingsItem
              title="Deliveries"
              Icon={Delivery}
              handlePress={() => {
                if (!user.user_permissions.includes('MGSHOP')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Manage Deliveries');
              }}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            /> */}
            <SettingsItem
              title="Discounts"
              Icon={Discount}
              handlePress={() => {
                if (!user.user_permissions.includes('MGUSSD')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Manage Discounts');
              }}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Sales Channels"
              Icon={SalesChannel}
              handlePress={() => {
                if (!user.user_permissions.includes('CHNMGT')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Sales Channels');
              }}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Receipt & Invoice"
              Icon={Store}
              handlePress={() => navigation.navigate('Receipt Details')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Taxes"
              Icon={Taxes}
              handlePress={() => navigation.navigate('Manage Taxes')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Notifications"
              Icon={Alert}
              handlePress={() => navigation.navigate('Manage Notifications')}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'SFProDisplay-Regular', color: '#777' }}>
            V{DeviceInfo.getVersion()} - Build: {DeviceInfo.getBuildNumber()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
