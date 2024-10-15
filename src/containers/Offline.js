/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import React from 'react';
import OfflineIcon from '../../assets/icons/offline.svg';
import { Pressable } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';
import SplashScreen from 'react-native-splash-screen';

const Offline = ({ updateState }) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={styles.main}>
      <Spinner
        visible={loading}
        textContent={'Checking Internet Connection'}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={{ alignItems: 'center' }}>
        <OfflineIcon height={59} width={59} />
        <Text style={styles.header}>You are offline</Text>
        <Text style={styles.sub}>
          It seems there is a problem with your internet connection. Please
          check you network status
        </Text>
      </View>
      <Pressable
        onPress={async () => {
          // setLoading(true);
          console.log('cccccccccccccccc');
          NetInfo.configure({
            reachabilityShortTimeout: 1000,
            reachabilityLongTimeout: 30000,
          });
          const state = await NetInfo.fetch();
          // setLoading(false);
          updateState({ isConnected: state.isConnected });
        }}
        style={{
          width: '85%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 16,
          backgroundColor: '#fff',
          borderRadius: 4,
          marginTop: 22,
        }}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            color: 'rgba(25, 66, 216, 0.78)',
            fontSize: 17,
          }}>
          Try Again
        </Text>
      </Pressable>
    </View>
  );
};

export default Offline;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    spinnerTextStyle: '#fff',
  },
  header: {
    fontFamily: 'Lato-Bold',
    color: '#30475e',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 8,
  },
  sub: {
    fontFamily: 'Lato-Medium',
    color: '#999',
    fontSize: 15,
    maxWidth: '90%',
    marginTop: 10,
  },
});
