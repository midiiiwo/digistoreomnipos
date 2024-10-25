/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager } from 'react-native-actions-sheet';

import { useActionCreator } from '../../hooks/useActionCreator';
import { useDeleteMerchantAccount } from '../../hooks/useDeleteMerchantAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';

function DeleteAccount(props) {
  const { setOverlayLoading, resetCart, resetStore, setAuth } =
    useActionCreator();
  const { user } = useSelector(state => state.auth);
  const toast = useToast();
  const client = useQueryClient();
  const deleteMerchantAccount = useDeleteMerchantAccount(async d => {
    if (d && d.status == 0) {
      setOverlayLoading(true);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('outlet');
      await AsyncStorage.removeItem('useSound');
      await AsyncStorage.removeItem('priority');
      await FastImage.clearDiskCache();
      await FastImage.clearMemoryCache();
      for (let i = 0; i < (user.user_unique_device_ids || []).length; i++) {
        await messaging().unsubscribeFromTopic(user.user_unique_device_ids[i]);
        console.log(
          `unsubscribed from topic: ${user.user_unique_device_ids[i]}`,
        );
      }
      PushNotification.removeAllDeliveredNotifications();
      // (user.user_unique_device_ids || []).forEach(async i => {
      //   await messaging().unsubscribeFromTopic(i);
      //   console.log(`unsubscribed from topic: ${i}`);
      // });

      // navigation.navigate('Login');
      resetCart();
      resetStore();
      client.clear();
      setOverlayLoading(false);
      SheetManager.hide('Delete Account');
      toast.show(d.message, { placement: 'top' });
      setAuth(false);
    }
  });
  return (
    <ActionSheet
      id={props.sheetId}
      statusBarTranslucent={false}
      drawUnderStatusBar={false}
      gestureEnabled={true}
      containerStyle={styles.containerStyle}
      // indicatorStyle={styles.indicatorStyle}
      onClose={() => {}}
      springOffset={50}
      defaultOverlayOpacity={0.3}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.mainText}>Danger Zone</Text>
        </View>
        <View style={{ alignItems: 'center', marginVertical: 22 }}>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Regular',
              color: '#62606A',
              fontSize: 16,
              textAlign: 'center',
              width: '80%',
            }}>
            Once you delete your account, you cannot recover it.
          </Text>
        </View>
        <View style={{ paddingHorizontal: 14 }}>
          <Pressable
            style={{
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 28,
              marginTop: 14,
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
            }}
            onPress={() => SheetManager.hide('Delete Account')}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#002',
                fontSize: 15,
              }}>
              Go Back
            </Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: '#cf222e',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 28,
              marginTop: 14,
            }}
            disabled={deleteMerchantAccount.isLoading}
            onPress={() =>
              deleteMerchantAccount.mutate({
                merchant: user.merchant,
                user: user.login,
              })
            }>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#fff',
                fontSize: 15,
              }}>
              {deleteMerchantAccount.isLoading
                ? 'Processing'
                : 'I understand, continue'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
    paddingBottom: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
    letterSpacing: 0.3,
  },
  mainText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    color: '#000002',
    // letterSpacing: -0.4,
  },
  done: {
    fontFamily: 'Inter-SemiBold',
    color: '#1942D8',
    fontSize: 15,
    letterSpacing: -0.8,
  },
  doneWrapper: {
    position: 'absolute',
    right: 22,
    top: 12,
  },
  channelType: {
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: 'rgba(146, 169, 189, 0.3)',
    borderBottomWidth: 0.3,
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  channelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#687980',
  },
  caret: {
    marginLeft: 'auto',
  },
});

export default DeleteAccount;
