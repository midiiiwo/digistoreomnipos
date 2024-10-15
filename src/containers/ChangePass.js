/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import React from 'react';
import { loginApi } from '../api/axiosInstance';
import { RadioGroup, RadioButton, SegmentedControl } from 'react-native-ui-lib';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';
import { Dimensions } from 'react-native';

const ChangePass = ({ route }) => {
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [radio, setRadio] = React.useState();
  const [verifyResponse, setVerifyResponse] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const navigation = useNavigation();

  const segments = [{ label: 'Use Mobile Number' }, { label: 'Use Username' }];
  const [usernameType, setUsernameType] = React.useState(0);
  const phoneInput = React.useRef(null);

  const verifyUser = async u => {
    const res = await loginApi.get(`/users/merchant/password/verify/${u}`);
    return res;
  };

  const sendOtp = async () => {
    const res = await loginApi.put('/users/merchant/password/code/generate', {
      id: verifyResponse && verifyResponse.id,
      contact: radio,
    });
    return res;
  };

  // React.useEffect(() => {
  //   if (route && route.params) {
  //     setUsername(route.params.username);
  //   }
  // }, [route]);

  return (
    <View style={styles.main}>
      <View style={styles.form}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 20,
            color: '#30475e',
            marginVertical: 12,
            marginBottom: 22,
          }}>
          Reset Pin
        </Text>
        <SegmentedControl
          segments={segments}
          activeBackgroundColor="rgba(71, 183, 73, 0.9)"
          activeColor="#fff"
          backgroundColor="#ffffff"
          outlineWidth={0}
          // containerStyle={{ height: 50 }}
          initialIndex={0}
          onChangeIndex={i => setUsernameType(i)}
          style={{ marginBottom: 14 }}
        />
        <Text
          numberOfLines={2}
          style={{
            fontFamily: 'Inter-Regular',
            color: '#30475e',
            fontSize: 13,
            marginVertical: Dimensions.get('window').height * 0.03,
            marginTop: Dimensions.get('window').height * 0.026,
            textAlign: 'center',
          }}>
          Enter your mobile number or username to proceed.
        </Text>
        {usernameType === 1 && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor="#B8BEC4"
              value={username}
              onChangeText={setUsername}
              cursorColor="#82AAE3"
            />
          </View>
        )}

        {usernameType === 0 && (
          // <View
          //   style={{
          //     // alignItems: 'center',
          //     backgroundColor: 'red',
          //   }}>
          <PhoneInput
            ref={phoneInput}
            defaultCode="GH"
            value={phone}
            layout="second"
            onChangeText={text => {
              setPhone(text);
            }}
            placeholder="Enter Mobile Number"
            textContainerStyle={{
              borderColor: '#ddd',
              borderWidth: 0.9,
              height: 56,
              borderLeftWidth: 0,
              borderRadius: 3,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingVertical: 0,
              paddingTop: 4,
            }}
            flagButtonStyle={{
              borderColor: '#ddd',
              borderWidth: 0.9,
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
            }}
            textInputStyle={{
              fontSize: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            // autoFocus
          />
          // </View>
        )}
        <Pressable
          disabled={(username.length === 0 && phone.length === 0) || loading}
          style={[
            styles.btn,
            {
              backgroundColor: 'rgba(71, 183, 73, 0.9)',
            },
          ]}
          onPress={async () => {
            if (!verifyResponse) {
              console.log('dddddddddd', phone);
              setLoading(true);
              let data;
              if (usernameType === 1) {
                const res = await verifyUser(encodeURIComponent(username));
                data = res.data;
              } else {
                const ph = phone.startsWith('0')
                  ? '+' + phoneInput.current.getCallingCode() + phone.slice(1)
                  : '+' + phoneInput.current.getCallingCode() + phone;
                const res = await verifyUser(encodeURIComponent(ph));
                data = res.data;
              }

              setLoading(false);
              if (data && data.status == 0) {
                setVerifyResponse(data.user);
              } else if (data && data.status != 0) {
                toast.show(data.message, { type: 'danger', placement: 'top' });
              }
            } else {
              if (!radio) {
                toast.show('Please select destination for OTP', {
                  type: 'danger',
                  placement: 'top',
                });
                return;
              }
              setLoading(true);
              const { data } = await sendOtp();
              setLoading(false);
              if (data && data.status == 0) {
                navigation.navigate('VerifyOnboardingOtp', {
                  id: verifyResponse && verifyResponse.id,
                });
                return;
              }
              toast.show(data.message, { type: 'danger', placement: 'top' });
            }

            // console.log('dddddddddd', data);
          }}>
          <Text style={styles.signin}>
            {loading
              ? 'Processing'
              : verifyResponse
              ? 'Send OTP'
              : 'Verify User'}
          </Text>
        </Pressable>
      </View>
      {verifyResponse && (
        <View style={{ marginTop: 10, paddingHorizontal: 22 }}>
          <Text
            style={{
              fontFamily: 'Lato-Medium',
              color: '#30475e',
              marginVertical: 12,
            }}>
            Send Otp to email or Phone
          </Text>
          <RadioGroup initialValue={radio} onValueChange={setRadio}>
            {verifyResponse.phoneMasked.length > 0 && (
              <RadioButton
                value="SMS"
                label={verifyResponse.phoneMasked}
                labelStyle={{ fontFamily: 'Lato-Semibold', fontSize: 15 }}
                color="#224390"
              />
            )}
            <View style={{ marginVertical: 8 }} />
            {verifyResponse.emailMasked.length > 0 && (
              <RadioButton
                value="EMAIL"
                label={verifyResponse.emailMasked}
                labelStyle={{ fontFamily: 'Lato-Semibold', fontSize: 15 }}
                color="#224390"
              />
            )}
          </RadioGroup>
        </View>
      )}
    </View>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  input: {
    height: '100%',

    borderRadius: 3,
    paddingHorizontal: 16,
    fontSize: 16,
    flex: 1,
    color: '#30475e',
    fontFamily: 'Lato-Regular',
  },
  inputWrapper: {
    height: 56,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 18,
    borderColor: '#ddd',
    borderWidth: 0.9,
    // width: '100%',
  },
  form: {
    paddingHorizontal: 20,
    // paddingTop: 5,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 3,
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
});
