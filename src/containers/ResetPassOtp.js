/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useToast } from 'react-native-toast-notifications';
// import Spinner from 'react-native-spinkit';
// import { useVerifyOnboardingAccount } from '../hooks/useVerifyOnboardingAccount';
// import { Pressable } from 'react-native';
// import { useGetOnboardingOtp } from '../hooks/useGetOnboardingOtp';
import clipboard from '@react-native-community/clipboard';
import { FAB } from 'react-native-paper';
import Help from '../../assets/icons/help.svg';
import { SheetManager } from 'react-native-actions-sheet';
import { useTimer } from 'react-timer-hook';
import { useSelector } from 'react-redux';
import { requestPinOtp } from '../api/merchant';
import { useMutation } from 'react-query';

function useRequestGenericOtp(handleSuccess) {
  // const client = useQueryClient();
  const queryResult = useMutation(
    ['pin-otp'],
    payload => {
      try {
        return requestPinOtp(payload);
      } catch (error) {}
    },
    {
      onSuccess(data) {
        handleSuccess && handleSuccess(data.data);
        // client.invalidateQueries('current-activation-step');
      },
    },
  );
  return queryResult;
}

const ResetPassOtp = ({ navigation, route }) => {
  // const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useSelector(state => state.auth);
  const { uid, destination } = route.params;
  const offsetDate = new Date();
  offsetDate.setSeconds(offsetDate.getSeconds() + 100);

  const { minutes, seconds, isRunning, restart } = useTimer({
    expiryTimestamp: offsetDate,
    autoStart: true,
  });

  const { mutate: getOtp } = useRequestGenericOtp(i => {
    toast.show(i?.message, { placement: 'top' });
  });
  // const { mutate, isLoading } = useVerifyOnboardingAccount(i => {
  //   // queryClient.invalidateQueries('account-list');
  //   setStatus(i);
  // });
  const inputRef = React.useRef();
  // const { mutate: getOtp } = useGetOnboardingOtp(setOtpStatus);

  React.useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focusField(0);
      }, 600);
    }
  }, []);

  return (
    <View style={styles.main}>
      <Text
        style={{
          color: '#204391',
          fontFamily: 'SFProDisplay-Semibold',
          fontSize: 28,
          marginTop: 26,
        }}>
        Enter OTP
      </Text>
      <Text
        style={{
          color: '#4D4D4D',
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 14,
          marginTop: 16,
          width: '80%',
          textAlign: 'center',
        }}>
        We have sent you access code via SMS for mobile number verification
      </Text>
      {/* <Text
        style={{
          color: '#4D4D4D',
          fontFamily: 'SFProDisplay-Regular',
          fontSize: 14,
          marginTop: 16,
          width: '80%',
          textAlign: 'center',
        }}>
        Enter the 6-digit code sent to you at:{' '}
        <Text style={{ fontWeight: '800' }}>+{phone}</Text>
      </Text> */}
      <OTPInputView
        style={{ width: '80%', height: 200 }}
        pinCount={6}
        ref={inputRef}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        placeholderTextColor="#30475e"
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          clipboard.setString('');
          navigation.navigate('Set Pin', { otp: code, uid });
        }}
        autoFocusOnLoad={false}
      />
      <View style={{ alignItems: 'center' }}>
        <Text
          onPress={() => navigation.goBack()}
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#0B9F6E',
            fontSize: 16,
            marginBottom: 14,
          }}>
          I want to change my account
        </Text>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Regular',
            color: '#4D4D4D',
            fontSize: 15,
          }}>
          Didn't receive the OTP?
        </Text>
        {!isRunning && (
          <Pressable
            style={{ marginTop: 14 }}
            onPress={() => {
              getOtp({
                notify_type: 'SMS',
                otp_type: 'SETPIN',
                merchant: user?.merchant,
                destination,
              });
              const offsetDate_ = new Date();
              offsetDate_.setSeconds(offsetDate_.getSeconds() + 120);
              restart(offsetDate_);
            }}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Medium',
                color: '#4D4D4D',
                fontSize: 16,
                textDecorationLine: 'underline',
              }}>
              Resend Code
            </Text>
          </Pressable>
        )}
        {isRunning && (
          <View style={{ flexDirection: 'row', marginTop: 14 }}>
            <Text style={styles.subText}>{`${minutes.toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}:${seconds.toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}`}</Text>
          </View>
        )}
      </View>
      <FAB
        icon={props => <Help {...props} />}
        style={styles.fab}
        onPress={() => SheetManager.show('support')}
        mode="flat"
      />
    </View>
  );
};

export default ResetPassOtp;

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

  borderStyleHighLighted: {
    borderColor: '#30475e',
  },

  underlineStyleBase: {
    width: 30,
    height: 55,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#30475e',
    color: '#30475e',
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    backgroundColor: '#F3F3F3',
  },
  subText: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#30475e',
    fontSize: 15,
    marginTop: 4,
    letterSpacing: 0.35,
  },
});
