/* eslint-disable react-native/no-inline-styles */
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Alert, Platform, UIManager } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { Provider, useSelector } from 'react-redux';
import { QueryClientProvider } from 'react-query';
import { ToastProvider } from 'react-native-toast-notifications';
import { LogBox } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
LogBox.ignoreLogs(['RNUILib']);
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from 'react-query';
// import JailMonkey from 'jail-monkey';
// import RNExit from 'react-native-exit-app';

import './src/components/BottomSheets/Sheets';

import RootNavigation from './src/navigation/DrawerNavigation';
import { store } from './src/redux/store';
import { queryClient } from './src/react-query';
import PushNotification, { Importance } from 'react-native-push-notification';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import CodePush from 'react-native-code-push';
import Spinner from 'react-native-loading-spinner-overlay';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens(true);

// if (Platform.OS === 'android') {
PushNotification.createChannel(
  {
    channelId: 'ipayghpos', // (required)
    channelName: 'sound', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'danish_bicycle_bell.mp3', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.createChannel(
  {
    channelId: 'silent', // (required)
    channelName: 'silent', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    // soundName: '', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.createChannel(
  {
    channelId: 'announcement', // (required)
    channelName: 'announcement', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    // soundName: '', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);
// }

let CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// To see all the requests in the chrome Dev tools in the network tab.

const App = ({ navigation }) => {
  // const { setFcmToken } = useActionCreator();
  // const { user } = useSelector(state => state.auth);
  // React.useEffect(() => {
  //   (async () => {
  //     let token;
  //     try {
  //       token = await AsyncStorage.getItem('fcmToken');
  //       if (!token) {
  //         token = await messaging().getToken();
  //         if (token) {
  //           await AsyncStorage.setItem('fcmToken', token);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     console.log('fcm token', token);
  //     setFcmToken(token);
  //   })();
  // }, [setFcmToken]);

  // React.useEffect(() => {
  //   (async () => {
  //     await AsyncStorage.removeItem('pushCheck');
  //   })();
  // }, []);

  // const PaymentNotification = async id => {
  //   var balance = await GetData(
  //     'paybills/payment/transaction/' +
  //       user.user_merchant_receivable +
  //       '/' +
  //       id,
  //   );
  //   //console.log(balance);
  //   if (balance.status == '0') {
  //     this.setState({ notificationModal: true, notification: balance.data });
  //   }
  // };

  React.useEffect(() => {
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
      });
    });
  }, []);

  // React.useEffect(() => {
  //   if (JailMonkey.isJailBroken()) {
  //     Alert.alert(
  //       'Rooted Device Detected',
  //       'You cannot use this app on a rooted device',
  //       [{ text: 'OK', onPress: () => RNExit.exitApp() }],
  //     );
  //   }
  // }, []);

  // React.useEffect(() => {
  //   (async () => {
  //     await messaging().registerDeviceForRemoteMessages();
  //     console.log('device registered for remote messaging');
  //   })();
  // }, []);

  // const { bottom } = useSafeAreaInsets();
  // StatusBar.setBackgroundColor('#f9f9f9');
  const { overlayLoading, overlayLoggingIn } = useSelector(
    state => state.merchant,
  );

  return (
    <AlertNotificationRoot theme="light">
      <QueryClientProvider client={queryClient}>
        <ToastProvider
          offsetTop={Platform.OS === 'ios' ? 60 : 40}
          style={{ zIndex: 10000000000 }}>
          <SheetProvider>
            <MenuProvider>
              <RootNavigation />
              <Spinner
                cancelable
                visible={overlayLoading}
                textContent={'Logging out'}
                textStyle={{ color: '#fff' }}
                overlayColor="rgba(0, 0, 0, 0.5)"
              />
              <Spinner
                visible={overlayLoggingIn}
                textContent={'Logging In'}
                textStyle={{ color: '#fff' }}
                overlayColor="rgba(0, 0, 0, 0.5)"
              />
            </MenuProvider>
          </SheetProvider>
          {/* </TourGuideProvider> */}
          {/* </SafeAreaView> */}
        </ToastProvider>
      </QueryClientProvider>
    </AlertNotificationRoot>
  );
};

const Root = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <App />
          </GestureHandlerRootView>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default CodePush(CodePushOptions)(Root);
