/* eslint-disable react-native/no-inline-styles */
import { Text, View, ScrollView } from 'react-native';
import Store_ from '../../assets/icons/store-1';
import OnlineStore from '../../assets/icons/online-store';
import ShortCode from '../../assets/icons/shortcode';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SettingsItem } from './Settings';
import { useGetCurrentActivationStep } from '../hooks/useGetCurrentActivationStep';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const SalesChannels = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.auth);
  const toast = useToast();
  let { data: activationStep } = useGetCurrentActivationStep(user.merchant);
  const step =
    activationStep &&
    activationStep.data &&
    activationStep.data.data &&
    activationStep.data.data.account_setup_step;
  return (
    <ScrollView style={{ backgroundColor: '#F7F8FA' }}>
      <View>
        <View style={{ paddingHorizontal: 17, marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: 'ReadexPro-Medium',
              fontSize: 22,
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
              handlePress={() => {
                if (!user.user_permissions.includes('MGOUTLET')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Manage Outlets');
              }}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Manage Online Store"
              Icon={OnlineStore}
              handlePress={() => {
                if (step) {
                  if (step != '8') {
                    toast.show(
                      'You must complete account activation before you can setup online store.',
                      { placement: 'top' },
                    );
                    return;
                  }
                  if (!user.user_permissions.includes('MGSHOP')) {
                    Toast.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Upgrade needed',
                      textBody:
                        "You don't have access to this feature. Please upgrade your account",
                    });
                    return;
                  }
                  navigation.navigate('Manage Store');
                }
              }}
            />
            <View
              style={{ borderBottomColor: '#eee', borderBottomWidth: 0.5 }}
            />
            <SettingsItem
              title="Manage Business Short code"
              Icon={ShortCode}
              handlePress={() => {
                if (step != '8') {
                  toast.show(
                    'You must complete account activation before you can setup online store.',
                    { placement: 'top' },
                  );
                  return;
                }
                if (!user.user_permissions.includes('USSDSHOP')) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Upgrade needed',
                    textBody:
                      "You don't have access to this feature. Please upgrade your account",
                  });
                  return;
                }
                navigation.navigate('Manage Shortcode');
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SalesChannels;
