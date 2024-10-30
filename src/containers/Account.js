/* eslint-disable react-native/no-inline-styles */
import { Text, View, Pressable, ScrollView } from 'react-native';
import Users from '../../assets/icons/users-multiple.svg';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';
import { SettingsItem } from './Settings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Account = () => {
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={{ paddingHorizontal: 17, marginBottom: 18 }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 22,
            color: '#002',
          }}>
          My Account
        </Text>
      </View>
      <ScrollView style={{ backgroundColor: '#F7F8FA' }}>
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
              title="Update Business Info & Logo"
              Icon={Users}
              handlePress={() => navigation.navigate('Edit Profile')}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 17,
          marginBottom: bottom + 6,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 13,
            borderColor: '#cf222e',
            borderWidth: 0.7,
          }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              fontSize: 15.5,
              color: '#002',
              marginBottom: 8,
            }}>
            Danger Zone
          </Text>
          <Pressable
            style={{
              backgroundColor: '#cf222e',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 6,
              marginTop: 14,
            }}
            onPress={() => SheetManager.show('Delete Account')}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#fff',
                fontSize: 15,
              }}>
              Delete Account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Account;
