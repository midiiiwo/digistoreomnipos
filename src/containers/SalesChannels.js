/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import Users_ from '../../assets/icons/users_';
import Store_ from '../../assets/icons/store-1';
import Delivery from '../../assets/icons/delivery-icon';
import OnlineStore from '../../assets/icons/online-store';
import ShortCode from '../../assets/icons/shortcode';
import UserSingle from '../../assets/icons/user-single';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Alert from '../../assets/icons/notifications-icon.svg';
import DeviceInfo from 'react-native-device-info';
import { SheetManager } from 'react-native-actions-sheet';
import Receipt from './Receipt';
import { SettingsItem } from './Settings';

const SalesChannels = () => {
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
            Sales Channels
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
              title="Manage Outlets"
              Icon={Store_}
              handlePress={() => navigation.navigate('Manage Outlets')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Manage Online Store"
              Icon={OnlineStore}
              handlePress={() => navigation.navigate('Manage Store')}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Manage Business Short code"
              Icon={ShortCode}
              handlePress={() => navigation.navigate('Manage Shortcode')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SalesChannels;
