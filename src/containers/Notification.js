/* eslint-disable react-native/no-inline-styles */
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { useActionCreator } from '../hooks/useActionCreator';
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import { Drawer } from 'react-native-ui-lib';
import NoNotif from '../../assets/icons/no-notifs';

const Notification = () => {
  const navigation = useNavigation();
  const { setNotification } = useActionCreator();
  const { user } = useSelector(state => state.auth);
  const [notifications, setNotifications] = React.useState();
  const [deliveredNotifications, setDeliveredNotifications] = React.useState(
    [],
  );

  // (async () => {
  //   await AsyncStorage.removeItem(user.merchant + 'notifications');
  // })();

  React.useEffect(() => {
    navigation.addListener('focus', async () => {
      const notifications_ = await AsyncStorage.getItem(
        user.merchant + 'notifications',
      );
      if (!notifications_) {
        setNotifications([]);
        return;
      }
      setNotifications(prev => [
        ...(prev || []),
        ...JSON.parse(notifications_),
      ]);
    });
  }, [setNotification, user.merchant, navigation]);

  React.useEffect(() => {
    (async () => {
      navigation.addListener('focus', () => {
        const t = [];
        PushNotification.getDeliveredNotifications(n => {
          n.forEach(async c => {
            const v = {
              title: c.title,
              body: c.body,
              time: new Date(),
              id:
                (c.body.startsWith('New Order Received')
                  ? 'order'
                  : 'payment') + c.body.split('#')[1],
              status: 'NEW',
              merchant: user.merchant,
            };
            t.unshift(v);
            // await AsyncStorage.setItem(
            //   user.merchant + 'notifications',
            //   JSON.stringify(v),
            // );
          });
          setDeliveredNotifications(t);
        });
      });
    })();
  }, [navigation, setNotification, user.merchant]);

  React.useEffect(() => {
    navigation.addListener('blur', async () => {
      notifications &&
        notifications.every((item, idx) => {
          if (item.status === 'NEW') {
            notifications[idx].status = 'SEEN';
            return true;
          }
          return false;
        });
      deliveredNotifications.every((item, idx) => {
        if (item.status === 'NEW') {
          deliveredNotifications[idx].status = 'SEEN';
          return true;
        }
        return false;
      });
      await AsyncStorage.setItem(
        user.merchant + 'notifications',
        JSON.stringify([...notifications]),
      );
      PushNotification.removeAllDeliveredNotifications();
      setNotification('');
    });
  }, [
    navigation,
    user.merchant,
    notifications,
    setNotification,
    deliveredNotifications,
  ]);

  if (!notifications) {
    return <Loading />;
  }

  return (
    <View style={styles.main}>
      <FlatList
        scrollEnabled
        data={uniqBy(
          [...notifications].filter(i => i.merchant === user.merchant),
          'id',
        )}
        ItemSeparatorComponent={() => (
          <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 0.2 }} />
        )}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{ alignItems: 'center' }}>
                <NoNotif height={66} width={66} />
                <Text
                  style={{
                    fontFamily: 'ReadexPro-Medium',
                    fontSize: 22,
                    color: '#aaa',
                    marginTop: 16,
                  }}>
                  No Notifications Yet
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 14, flex: 1 }}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <Drawer
              rightItems={[
                {
                  text: 'Delete',
                  background: 'red',
                  onPress: async () => {
                    const notifications_ = await AsyncStorage.getItem(
                      user.merchant + 'notifications',
                    );
                    const notif_ = JSON.parse(notifications_).filter(
                      i => i.id !== item.id,
                    );
                    await AsyncStorage.setItem(
                      user.merchant + 'notifications',
                      JSON.stringify(notif_),
                    );
                    setNotifications(notif_);
                  },
                },
              ]}>
              <Pressable
                onPress={() => {
                  // console.log('iiiiiiiiiiii', item.id.slice(5));
                  if (item.body && item.body.startsWith('New Order Received')) {
                    navigation.navigate('Order Details', {
                      id: item.id.slice(5),
                    });
                  }
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: '#fff',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      height: 9,
                      width: 9,
                      backgroundColor:
                        item.status === 'NEW' ? '#568CCA' : '#D9D9D9',
                      borderRadius: 10,
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily:
                        item.status === 'NEW'
                          ? 'ReadexPro-bold'
                          : 'ReadexPro-Medium',
                      color: item.status === 'NEW' ? '#30475e' : '#6D8299',
                      fontSize: 15,
                    }}>
                    {item.title}
                  </Text>
                </View>
                <View style={{ paddingLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Regular',
                      color: item.status === 'NEW' ? '#30475e' : '#6D8299',
                      fontSize: 14,
                    }}>
                    {item.body}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'ReadexPro-Regular',
                      color: item.status === 'NEW' ? '#30475e' : '#6D8299',
                      fontSize: 13,
                      marginTop: 6,
                      // textAlign: 'right',
                    }}>
                    {new Date(item.time).toString().slice(0, 21)}
                  </Text>
                </View>
              </Pressable>
            </Drawer>
          );
        }}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 2,
  },
});
