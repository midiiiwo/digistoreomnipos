/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import React from 'react';
import PinView from 'react-native-pin-view';
import Backspace from '../../assets/icons/backspace.svg';
import Lock from '../../assets/icons/lock.svg';
import { loginApi } from '../api/axiosInstance';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActionCreator } from '../hooks/useActionCreator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import publicIP from 'react-native-public-ip';
import DeviceInfo from 'react-native-device-info';
import { capitalize } from 'lodash';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const BackspaceComp = ({ bRef }) => {
  return (
    <Pressable
      onPress={() => bRef.current.clear()}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Backspace />
    </Pressable>
  );
};

const OperatorLockScreen = ({ route }) => {
  const navigation = useNavigation();
  const { username } = route.params;
  const { setCurrentUser, setAuth, setLoggininOverlay } = useActionCreator();
  const [_, setLoading] = React.useState(false);
  const ref = React.useRef();
  const [input, setInput] = React.useState('');
  const { bottom } = useSafeAreaInsets();
  const [ip, setIp] = React.useState('');

  const toast = useToast();
  const signin = async (user, pin) => {
    setLoading(true);
    setLoggininOverlay(true);
    let response;
    const metaData = {
      ip_address: ip,
      unique_id: DeviceInfo.getUniqueIdSync(),
      device_brand:
        capitalize(DeviceInfo.getBrand()) + ' ' + DeviceInfo.getModel(),
      device_os: capitalize(Platform.OS),
    };
    try {
      response = await loginApi.post('login/merchant/pin', {
        username: user?.trim(),
        pin,
        device_meta_data: JSON.stringify(metaData),
      });
      setLoading(false);
    } catch (error) { }
    setLoggininOverlay(false);
    return response;
  };

  React.useEffect(() => {
    publicIP()
      .then(ip_ => {
        setIp(ip_);
      })
      .catch(error => {
        console.log(error);
        setIp('');
      });
  }, []);

  React.useEffect(() => {
    if (input.length === 4) {
      signin(username, input).then(res => {
        const { data } = res;
        if (data) {
          if (data.status == 99) {
            toast.show(data.message, { placement: 'top', type: 'danger' });
            ref.current.clearAll();
            return;
          }
          if (data.status == 0 || data.device_authorized === 'YES') {
            ref.current.clearAll();
            if (data) {
              AsyncStorage.setItem('user', JSON.stringify(data));
              setCurrentUser({
                ...data,
                merchant: data.user_merchant_id,
                outlet: data.user_merchant_group_id,
              });
              setAuth(true);
              navigation.navigate('Outlets Login');
            }
          } else if (
            data.status == 92 ||
            data.device_authorized === 'PENDING'
          ) {
            toast.show(data.message, {
              placement: 'top',
              type: 'normal',
              duration: 9000,
              textStyle: { textAlign: 'center' },
            });
            navigation.goBack();
          } else if (data.status == 91 || data.device_authorized === 'NEW') {
            navigation.navigate('Login OTP', {
              data,
              deviceId: DeviceInfo.getUniqueIdSync(),
            });
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, username, toast, navigation, setAuth, setCurrentUser]);

  return (
    <View style={styles.main}>
      <View style={{ alignItems: 'center', paddingTop: 0 }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 22,
            color: '#1F2122',
          }}>
          Enter Pin
        </Text>
        <View style={{ marginTop: Dimensions.get('window').height * 0.01 }}>
          {/* <Spinner type="Wave" isVisible={loading} /> */}
          <Lock height={38} width={38} />
        </View>
      </View>
      <PinView
        onValueChange={v => setInput(v)}
        pinLength={4}
        ref={ref}
        style={{ flex: 1 }}
        customRightButton={<BackspaceComp bRef={ref} />}
        buttonAreaStyle={{
          marginTop: 'auto',
          marginBottom: 'auto',
          width: Dimensions.get('window').width * 0.5,
          height: Dimensions.get('window').width * 0.3,
        }}
        inputAreaStyle={{
          marginTop: 'auto',
        }}
        inputViewEmptyStyle={{
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#ddd',
          height: 30,
          width: 30,
          // display: 'none',
        }}
        inputViewFilledStyle={{
          backgroundColor: '#1F2122',
          height: 24,
          width: 24,
        }}
        buttonViewStyle={{
          backgroundColor: '#EAEBED',
          height: 94,
          width: 94,
          borderRadius: 100,
        }}
        buttonTextStyle={{
          color: '#1F2122',
          fontSize: 34,
          fontFamily: 'SFProDisplay-Medium',
        }}
      />
      <Pressable
        style={{
          paddingTop: 6,
          alignItems: 'center',
          marginBottom: Platform.OS === 'ios' ? bottom + 4 : 22,
        }}
        onPress={() => {
          navigation.navigate('ChangePass', { username });
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#30475e',
            fontFamily: 'SFProDisplay-Medium',
          }}>
          Forgot Pin?
        </Text>
      </Pressable>
    </View>
  );
};

export default OperatorLockScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
