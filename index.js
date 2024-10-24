/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { showLocalNotification } from './src/utils/pushNotification';
import DeviceInfo from 'react-native-device-info';

// showLocalNotification;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('indiendineidneid', DeviceInfo.getBrand(), remoteMessage);
  const { body } = (remoteMessage && remoteMessage.notification) || {
    body: '',
    title: '',
  };
  showLocalNotification(
    {
      title:
        remoteMessage &&
        remoteMessage.notification &&
        remoteMessage.notification.title,
      body,
      id: remoteMessage.messageId,
    },
    remoteMessage.messageId,
  );
  return Promise.resolve();
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

// AppRegistry.registerHeadlessTask(
//   'ReactNativeFirebaseMessagingHeadlessTask',
//   () => firebaseBackgroundMessage,
// );

AppRegistry.registerComponent(appName, () => HeadlessCheck);
