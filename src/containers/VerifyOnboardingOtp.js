/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useToast } from 'react-native-toast-notifications';
import { loginApi } from '../api/axiosInstance';
import Spinner from 'react-native-spinkit';
import { Dimensions } from 'react-native';

const VerifyOnboardingOtp = ({ navigation, route }) => {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState();
  const toast = useToast();
  const inputRef = React.useRef();
  const { id } = route.params;
  React.useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focusField(0);
      }, 600);
    }
  }, []);

  const verifyOtp = async code => {
    const res = loginApi.put('/users/merchant/password/code/validate', {
      id,
      code,
    });
    return res;
  };

  return (
    <View style={styles.main}>
      <Text
        style={{
          color: '#30475e',
          fontFamily: 'Inter-SemiBold',
          fontSize: 16,
          marginTop: 26,
        }}>
        Enter OTP verification code
      </Text>
      <View style={{ height: 40, marginTop: 18 }}>
        {loading && <Spinner type="Wave" isVisible={loading} />}
      </View>

      {/* <OtpInputs
        handleChange={code => console.log(code)}
        numberOfInputs={6}
        autofillFromClipboard
        autoFocus
        selectionColor="red"
      /> */}
      <OTPInputView
        style={{ width: '80%', height: Dimensions.get('window').height * 0.2 }}
        pinCount={7}
        autoFocusOnLoad={false}
        ref={inputRef}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        placeholderTextColor="#30475e"
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={async code => {
          setLoading(true);
          const { data } = await verifyOtp(code);
          setLoading(false);
          if (data.status == 0) {
            toast.show(data.message, { placement: 'top', type: 'success' });
            navigation.navigate('Reset Pass', { uid: id });
          } else {
            toast.show(data.message, { placement: 'top', type: 'danger' });
          }
        }}
      />
    </View>
  );
};

export default VerifyOnboardingOtp;

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
});
