/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useToast } from 'react-native-toast-notifications';
import { useSelector } from 'react-redux';
import Spinner from 'react-native-spinkit';
import { useVerifyOnboardingAccount } from '../hooks/useVerifyOnboardingAccount';
import { Pressable } from 'react-native';
import { useGetOnboardingOtp } from '../hooks/useGetOnboardingOtp';
import clipboard from '@react-native-community/clipboard';
import { FAB } from 'react-native-paper';
import Help from '../../assets/icons/help.svg';
import { SheetManager } from 'react-native-actions-sheet';

const SignupOtp = ({ navigation, route }) => {
  const [status, setStatus] = React.useState();
  // const queryClient = useQueryClient();
  const toast = useToast();
  const [otpStatus, setOtpStatus] = React.useState();
  // const { user } = useSelector(state => state.auth);
  const { phone } = route.params;
  const { mutate, isLoading } = useVerifyOnboardingAccount(i => {
    // queryClient.invalidateQueries('account-list');
    setStatus(i);
  });
  const inputRef = React.useRef();
  const { mutate: getOtp, isLoading: otpLoading } =
    useGetOnboardingOtp(setOtpStatus);

  React.useEffect(() => {
    if (otpStatus) {
      toast.show(otpStatus.message, { placement: 'top' });
      setOtpStatus(null);
    }
  }, [toast, otpStatus]);

  React.useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focusField(0);
      }, 600);
    }
  }, []);

  React.useEffect(() => {
    // console.log('stattussuus', status);
    if (status && status.status == 0) {
      navigation.navigate('Signup', {
        phone,
        countryCode: route.params.countryCode,
      });
      clipboard.setString('');
    } else if (status && status != 0) {
      toast.show(status.message, {
        placement: 'top',
        type: 'danger',
      });
      setStatus(null);
      clipboard.setString('');
    }
    setStatus(null);
  }, [navigation, status, toast, phone, route]);

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
      {isLoading && <Spinner type="Wave" isVisible={isLoading} />}
      {/* <OtpInputs
        handleChange={code => console.log(code)}
        numberOfInputs={6}
        autofillFromClipboard
        autoFocus
        selectionColor="red"
      /> */}
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
          mutate({
            otp: code,
            contact_phone: phone,
          });
        }}
        autoFocusOnLoad={false}
      />
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            color: '#4D4D4D',
            fontSize: 15,
          }}>
          Didn't receive the OTP?
        </Text>
        <Pressable
          style={{ marginTop: 14 }}
          onPress={() => {
            // toast.show('')
            getOtp({
              contact_phone: phone,
            });
          }}>
          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              color: '#4D4D4D',
              fontSize: 16,
            }}>
            Resend Code
          </Text>
        </Pressable>
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

export default SignupOtp;

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
});
