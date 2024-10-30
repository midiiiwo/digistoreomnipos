import { StyleSheet, View } from 'react-native';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { useActionCreator } from '../hooks/useActionCreator';
import { useMutation, useQueryClient } from 'react-query';
import { logout as $logout } from '../api/merchant';
import moment from 'moment';

function useLogout(handleSuccess) {
  const queryResult = useMutation(
    ['logout'],
    payload => {
      try {
        return $logout(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}

const Logout = () => {
  const { user } = useSelector(state => state.auth);
  const { resetCart, resetStore, setOverlayLoading, setAuth, resetInvoice } =
    useActionCreator();
  const client = useQueryClient();
  const unsubscribeFromTopics = async () => {
    var fcm = user?.user_unique_device_ids;
    for (var f in fcm) {
      const fcmData = fcm[f];

      messaging()
        .unsubscribeFromTopic(fcmData)
        .then(() => {
          console.log(`unsubscribed from topic: ${fcmData}`);
        });
    }
  };

  const { mutateAsync } = useLogout(() => {});

  const logout = async () => {
    setOverlayLoading(true);
    await mutateAsync({
      id: user?.uid,
      end_date: moment(new Date()).format('DD-MM-YYYY'),
    });
    await unsubscribeFromTopics();

    PushNotification.removeAllDeliveredNotifications();

    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('outlet');
    await AsyncStorage.removeItem('useSound');
    await AsyncStorage.removeItem('priority');
    await FastImage.clearDiskCache();
    await FastImage.clearMemoryCache();

    resetCart();
    resetStore();
    client.clear();
    setOverlayLoading(false);
    setAuth(false);
    resetInvoice();
  };

  React.useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View style={styles.main} />;
};

export default Logout;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
