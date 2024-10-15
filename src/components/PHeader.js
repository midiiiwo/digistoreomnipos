/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Pressable, AppState, Text } from 'react-native';
import ProfileIcon from '../../assets/icons/profile-circle.svg';
import Alert from '../../assets/icons/notifications-icon.svg';
import PushNotification from 'react-native-push-notification';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useActionCreator } from '../hooks/useActionCreator';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';

const PHeader = ({
  navigation,
  backgroundColor,
  showNotificationIcon = false,
}) => {
  const { notification } = useSelector(state => state.merchant);
  const [notifsAvailable, setNotifsAvailable] = React.useState([]);
  const appState = React.useRef(AppState.currentState);
  // const tabValues = ['Products', 'Categories'];
  const { top } = useSafeAreaInsets();
  const { activeProductsTab } = useSelector(state => state.products);
  const { setActiveProductsTab } = useActionCreator();

  const productIsActive = activeProductsTab === 0;
  const categoryIsActive = activeProductsTab === 1;
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
    <View
      style={[
        styles.headerMain,
        {
          paddingTop: 12 + top,
          backgroundColor: backgroundColor ? backgroundColor : '#fff',
        },
      ]}>
      <Pressable
        onPress={() => {
          navigation.openDrawer();
        }}>
        <ProfileIcon height={38} width={38} stroke="#30475e" />
      </Pressable>

      <View style={styles.segmentedControlWrapper}>
        <ShadowedView
          style={shadowStyle({
            opacity: productIsActive ? 0 : 0.1,
            radius: productIsActive ? 0 : 1.5,
            offset: [0, 0],
          })}>
          <Pressable
            onPress={() => setActiveProductsTab(0)}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: productIsActive ? '#0069FF' : '#fff',
              paddingHorizontal: 22,
              paddingVertical: 10,
              borderRadius: 30,
            }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                color: productIsActive ? '#fff' : '#304753',
                fontSize: 15,
              }}>
              Products
            </Text>
          </Pressable>
        </ShadowedView>
        <View style={{ marginHorizontal: 8 }} />
        <ShadowedView
          style={shadowStyle({
            opacity: categoryIsActive ? 0 : 0.1,
            radius: categoryIsActive ? 0 : 1.5,
            offset: [0, 0],
          })}>
          <Pressable
            onPress={() => setActiveProductsTab(1)}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: categoryIsActive ? '#0069FF' : '#fff',
              paddingHorizontal: 22,
              paddingVertical: 10,
              borderRadius: 30,
            }}>
            <Text
              style={{
                fontFamily: 'ReadexPro-Medium',
                color: categoryIsActive ? '#fff' : '#304753',
                fontSize: 15,
              }}>
              Categories
            </Text>
          </Pressable>
        </ShadowedView>
        {/* <SegmentedControl
          values={tabValues}
          selectedIndex={activeProductsTab}
          onChange={event => {
            console.log('eeeeeee', event.nativeEvent.selectedSegmentIndex);
            setActiveProductsTab(event.nativeEvent.selectedSegmentIndex);
          }}
          backgroundColor="rgba(96, 126, 170, 0.05)"
          tintColor="rgba(25, 66, 216, 0.9)"
          activeFontStyle={styles.activeText}
          fontStyle={styles.inactiveText}
          style={styles.arbitrary}
        /> */}
      </View>

      <View style={styles.rightIcons}>
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
            {showNotificationIcon && (
              <Alert height={38} width={38} stroke="#30475e" />
            )}
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

    paddingVertical: Dimensions.get('window').width * 0.01,
  },
  rightIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedControlWrapper: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  activeText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'ReadexPro-Medium',
    fontWeight: '100',
    letterSpacing: 0.5,
  },
  inactiveText: {
    fontSize: 18,
    color: '#30475e',
    fontFamily: 'ReadexPro-Medium',
    fontWeight: '100',
    letterSpacing: 0.5,
  },
  headerText: {
    marginLeft: 'auto',
    marginRight: 14,
    color: '#1942D8',
    fontFamily: 'ReadexPro-Medium',
  },
  arbitrary: {
    height: 50,
    width: 300,
  },
});

export default PHeader;
