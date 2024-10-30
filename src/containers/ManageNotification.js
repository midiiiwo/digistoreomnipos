/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import { useActionCreator } from '../hooks/useActionCreator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, { Importance } from 'react-native-push-notification';

function ManageNotifications(props) {
  const { notificationSound } = useSelector(state => state.merchant);
  const { setNotificationSound } = useActionCreator();

  React.useEffect(() => {
    (async () => {
      const status = await AsyncStorage.getItem('useSound');
      if (!status) {
        setNotificationSound(true);
        return;
      }
      if (status === 'YES') {
        setNotificationSound(true);
      } else {
        setNotificationSound(false);
      }
    })();
  }, [setNotificationSound]);

  return (
    <View style={styles.main}>
      <View style={{ paddingHorizontal: 22, marginBottom: 13 }}>
        <Text
          style={{
            fontFamily: 'ReadexPro-Medium',
            fontSize: 22,
            color: '#002',
            marginBottom: Dimensions.get('window').height * 0.02,
          }}>
          Configure Notification
        </Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 8,
            }}>
            <View style={{ maxWidth: '80%' }}>
              <Text
                style={{
                  fontFamily: 'ReadexPro-Medium',
                  fontSize: 15,
                  color: '#30475e',
                }}>
                Turn on/off notification sound
              </Text>
              <View style={{ marginVertical: 1 }} />
              <Text
                style={{
                  fontFamily: 'ReadexPro-Regular',
                  fontSize: 13,
                  color: '#888',
                }}>
                Play sound for incoming notifications
              </Text>
            </View>
            <View style={{ marginLeft: 'auto' }}>
              <ToggleSwitch
                isOn={notificationSound}
                onToggle={async status => {
                  if (status) {
                    await AsyncStorage.setItem('useSound', 'YES');
                    PushNotification.createChannel(
                      {
                        channelId: 'ipayghpos', // (required)
                        channelName: 'sound', // (required)
                        channelDescription:
                          'A channel to categorise your notifications', // (optional) default: undefined.
                        playSound: true, // (optional) default: true
                        soundName: 'danish_bicycle_bell.mp3', // (optional) See `soundName` parameter of `localNotification` function
                        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
                      },
                      created =>
                        console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
                    );
                  } else {
                    await AsyncStorage.setItem('useSound', 'NO');
                    PushNotification.channelExists('ipayghpos', exists => {
                      if (exists) {
                        PushNotification.deleteChannel('ipayghpos');
                        console.log('deleted ipayghpos channel');
                      }
                    });
                  }
                  setNotificationSound(status);
                }}
              />
            </View>
          </View>
        </View>
        {/* <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 8,
            }}>
            <View style={{ maxWidth: '80%' }}>
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 17,
                  color: '#30475e',
                }}>
                Use high priority notifications
              </Text>
              <View style={{ marginVertical: 1 }} />
              <Text
                style={{
                  fontFamily: 'SFProDisplay-Regular',
                  fontSize: 14,
                  color: '#888',
                }}>
                Show previews of notifications at the top of the screen
              </Text>
            </View>
            <View style={{ marginLeft: 'auto' }}>
              <ToggleSwitch
                isOn={notificationPriority}
                onToggle={async status => {
                  if (status) {
                    await AsyncStorage.setItem('priority', 'YES');
                  } else {
                    await AsyncStorage.setItem('priority', 'NO');
                  }
                  setNotificationPriority(status);
                }}
              />
            </View>
          </View>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  main: {
    paddingBottom: 12,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomColor: 'rgba(146, 169, 189, 0.5)',
    borderBottomWidth: 0.3,
  },
  mainText: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: '#30475E',
    letterSpacing: -0.2,
  },

  channelText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    color: '#30465e',
    marginBottom: 2,
  },
  address: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 14,
    color: '#687980',
  },
  caret: {
    marginLeft: 'auto',
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopColor: '#ddd',
    borderTopWidth: 0.6,
  },
  btn: {
    borderRadius: 4,
    width: '90%',
  },
});

export default ManageNotifications;
