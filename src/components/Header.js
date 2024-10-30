/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, AppState } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
// import QrIcon from '../../assets/icons/qr.svg';
import Alert from '../../assets/icons/notifications-icon.svg';
import PushNotification from 'react-native-push-notification';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ navigation }) => {
  const { notification } = useSelector(state => state.merchant);
  const [notifsAvailable, setNotifsAvailable] = React.useState([]);
  const appState = React.useRef(AppState.currentState);
  const { top } = useSafeAreaInsets();
  React.useEffect(() => {
    PushNotification.getDeliveredNotifications(i => {
      setNotifsAvailable(i);
    });
  }, [notification]);

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      PushNotification.getDeliveredNotifications(i => {
        setNotifsAvailable(i);
      });
    });
  }, [navigation]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        PushNotification.getDeliveredNotifications(i => {
          setNotifsAvailable(i);
        });
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <View style={[styles.headerMain, { paddingTop: top + 12 }]}>
      <Pressable
        onPress={() => {
          navigation.openDrawer();
        }}>
        <ProfileIcon height={34} width={34} stroke="#091D60" />
      </Pressable>

      {/* <Image source={require('../../assets/images/logo.png')} /> */}

      <View style={styles.rightIcons}>
        {/* <Pressable style={{ marginRight: 8 }}>
          <QrIcon height={35} width={35} />
        </Pressable> */}
        <Pressable
          style={{ marginRight: 4 }}
          onPress={() => navigation.navigate('Notification')}>
          <View>
            {notifsAvailable.length > 0 && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  position: 'absolute',
                  right: 6,
                  zIndex: 100,
                  borderRadius: 20,
                  backgroundColor: '#3C79F5',
                }}
              />
            )}
            <Alert height={34} width={34} stroke="#091D60" />
          </View>
        </Pressable>
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

    paddingVertical: Dimensions.get('window').width * 0.013,
  },
  rightIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
