/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import Store from '../../assets/icons/store.svg';
import Taxes from '../../assets/icons/tax.svg';
import Users from '../../assets/icons/users-multiple.svg';
import Caret from '../../assets/icons/cart-right.svg';
import Users_ from '../../assets/icons/users_';
import Store_ from '../../assets/icons/store-1';
import Delivery from '../../assets/icons/delivery-icon';
import OnlineStore from '../../assets/icons/online-store';
import SalesChannel from '../../assets/icons/saleschannel';
import UserSingle from '../../assets/icons/user-single';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Alert from '../../assets/icons/notifications-icon.svg';
import DeviceInfo from 'react-native-device-info';
import { SheetManager } from 'react-native-actions-sheet';
import Receipt from './Receipt';

export const SettingsItem = ({ title, Icon, handlePress, extraStyles }) => {
  console.log('dddddddd', extraStyles);
  return (
    <Pressable
      onPress={handlePress}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {Icon && (
        <Icon
          height={20}
          width={20}
          stroke="#002"
          style={{ marginRight: 13 }}
        />
      )}
      <Text
        style={{
          fontFamily: 'SFProDisplay-Regular',
          color: '#002',
          fontSize: 18.8,
        }}>
        {title}
      </Text>
      <View style={{ marginLeft: 'auto' }}>
        <Caret height={16} width={16} />
      </View>
    </Pressable>
  );
};

const Settings = () => {
  const navigation = useNavigation();
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
              handlePress={() => navigation.navigate('Manage Users')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Deliveries"
              Icon={Delivery}
              handlePress={() => navigation.navigate('Manage Deliveries')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Sales Channels"
              Icon={SalesChannel}
              handlePress={() => navigation.navigate('Sales Channels')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Receipt"
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
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              color: '#777',
              fontSize: 17,
            }}>
            V{DeviceInfo.getVersion()} - Build: {DeviceInfo.getBuildNumber()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
