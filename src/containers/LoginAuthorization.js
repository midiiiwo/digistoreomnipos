/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import { useToast } from 'react-native-toast-notifications';
import { loginApi } from '../api/axiosInstance';
import { Dimensions } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActionCreator } from '../hooks/useActionCreator';
import Lottie from 'lottie-react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';

import { useMutation } from 'react-query';
import { useTimer } from 'react-timer-hook';

export function useConfirmAuthorization(handleSuccess) {
  const queryResult = useMutation(
    ['confirm-authorization'],
    payload => {
      try {
        return loginApi.post('/login/merchant/device/authorize', payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess(data.data);
      },
      onError(data) {
        handleSuccess(data.data);
      },
    },
  );
  return queryResult;
}

const LoginAuthorization = ({ route }) => {
  const navigation = useNavigation();
  const toast = useToast();
  const inputRef = React.useRef();
  const { data, deviceId } = route.params;
  const { setCurrentUser } = useActionCreator();
  let count = React.useRef(0);

  const offsetDate = new Date();
  offsetDate.setSeconds(offsetDate.getSeconds() + 50);

  const { minutes, seconds } = useTimer({
    expiryTimestamp: offsetDate,
    autoStart: true,
  });

  const { mutate } = useConfirmAuthorization(result => {
    if (result) {
      if (result.device_authorized === 'YES' && result.status == 0) {
        // AsyncStorage.setItem('user', JSON.stringify(result));
        setCurrentUser({
          ...result,
          merchant: result.user_merchant_id,
          outlet: result.user_merchant_group_id,
        });
        navigation.navigate('Outlets Login');
      } else if (
        result.device_authorized === 'PENDING' &&
        result.status == 92 &&
        count.current > 4
      ) {
        toast.show(data.message, {
          placement: 'top',
          type: 'normal',
          duration: 9000,
          textStyle: { textAlign: 'center' },
        });
        navigation.navigate('Login');
      }
    }
  });

  React.useEffect(() => {
    const id = setInterval(() => {
      mutate({
        uid: data.uid,
        device: deviceId,
      });
      if (count.current >= 4) {
        clearInterval(id);
      }
      count.current += 1;
    }, 10000);

    return () => clearInterval(id);
  }, [deviceId, data, mutate]);

  React.useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focusField(0);
      }, 600);
    }
  }, []);

  return (
    <View style={styles.main}>
      <Lottie
        source={require('../lottie/Animation - 1707481699582.json')}
        autoPlay
        loop
        autoSize
      />
      <View style={{ flexDirection: 'row', marginTop: 14 }}>
        <Text
          style={{
            color: '#30475e',
            fontFamily: 'IBMPlexSans-Medium',
            fontSize: 16,
          }}>{`${minutes.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}:${seconds.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`}</Text>
      </View>
      <Text
        style={{
          color: '#30475e',
          fontFamily: 'IBMPlexSans-Bold',
          fontSize: 18,
          marginTop: Dimensions.get('window').height * 0.05,
        }}>
        Waiting for authorization approval
      </Text>

      <Text
        style={{
          color: '#30475e',
          fontFamily: 'IBMPlexSans-Regular',
          fontSize: 14.5,
          marginTop: 22,
          textAlign: 'center',
          maxWidth: '80%',
        }}>
        {data && data.message}
      </Text>
      <View style={styles.btnWrapper}>
        <PrimaryButton
          handlePress={() => navigation.navigate('Login')}
          style={styles.btn}>
          Cancel
        </PrimaryButton>
      </View>
    </View>
  );
};

export default LoginAuthorization;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
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
  borderStyleHighLighted: {
    borderColor: '#30475e',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
