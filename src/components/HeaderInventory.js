/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import User from '../../assets/icons/user.svg';
import ArrowLeftShort from '../../assets/icons/arrow-left-short.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';

const HeaderInventory = ({
  navigation,
  backgroundColor,
  showNotificationIcon = false,
}) => {
  const { outlet } = useSelector(state => state.auth);
  const { customer } = useSelector(state => state.sale);
  const inset = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.headerMain,
        {
          paddingTop: 12 + inset.top,
          backgroundColor: backgroundColor ? backgroundColor : '#fff',
        },
      ]}>
      <ShadowedView
        style={shadowStyle({
          opacity: 0.15,
          radius: 1.5,
          offset: [0, 0],
        })}>
        <Pressable
          onPress={() => {
            navigation.openDrawer();
          }}
          style={{
            backgroundColor: '#fff',
            borderRadius: 60,
            padding: 10,
          }}>
          <ProfileIcon height={28} width={27} stroke="#30475e" />
        </Pressable>
      </ShadowedView>
      <View
        style={{
          marginLeft: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {customer ? (
          <Pressable
            style={[
              styles.headerTextWrapper,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
            onPress={() => navigation.navigate('Customer Select')}>
            <User height={20} width={20} fill="#fff" />
            <Text
              numberOfLines={1}
              style={[
                styles.headerText,
                {
                  marginLeft: 3,
                  maxWidth: '84%',
                  textAlign: 'right',
                  color: '#fff',
                },
              ]}>
              {customer.customer_name}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.headerTextWrapper}
            onPress={() => navigation.navigate('Customer Select')}>
            <Text style={styles.headerText}>Add Customer</Text>
          </Pressable>
        )}
        <ShadowedView
          style={shadowStyle({
            opacity: 0.1,
            radius: 1.5,
            offset: [0, 0],
          })}>
          <Pressable
            onPress={() => navigation.navigate('Outlets')}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 30,
            }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                color: '#304753',
                fontSize: 16,
              }}>
              {outlet && outlet.outlet_name}
            </Text>
            <ArrowLeftShort style={{ marginLeft: 2 }} height={18} width={18} />
          </Pressable>
        </ShadowedView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerMain: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,

    paddingVertical: Dimensions.get('window').width * 0.01,
  },
  rightIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrapper: {
    backgroundColor: '#0069FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    marginRight: 12,
  },
  headerText: {
    // marginLeft: 'auto',
    // marginRight: 14,
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
  },
});

export default HeaderInventory;
