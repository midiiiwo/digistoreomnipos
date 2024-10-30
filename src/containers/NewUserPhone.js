/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { useGetOnboardingOtp } from '../hooks/useGetOnboardingOtp';
import { useToast } from 'react-native-toast-notifications';
import { SheetManager } from 'react-native-actions-sheet';
import Help from '../../assets/icons/help.svg';
import { FAB } from 'react-native-paper';
const NewUserPhone = ({ navigation, route }) => {
  const [value, setValue] = React.useState('');
  const [_, setFormattedValue] = React.useState('');
  // const [valid, setValid] = React.useState(false);
  // const [showMessage, setShowMessage] = React.useState(false);
  const phoneInput = React.useRef(null);
  const [otpStatus, setOtpStatus] = React.useState();
  const { mutate, isLoading } = useGetOnboardingOtp(setOtpStatus);
  const toast = useToast();
  const imgWidth = Dimensions.get('window').width * 0.58;

  React.useEffect(() => {
    if (otpStatus && otpStatus.status == 0 && otpStatus.has_pin == 'YES') {
      toast.show('User already exists', {
        placement: 'top',
        type: 'danger',
      });
      setOtpStatus(null);
    } else if (otpStatus && otpStatus.status == 0) {
      if (otpStatus.message == 'Success: User exist') {
        toast.show('User already exists', { placement: 'top', type: 'danger' });
        setOtpStatus(null);
        return;
      }
      const ph = !value.startsWith('0')
        ? phoneInput.current.getCallingCode() + value
        : phoneInput.current.getCallingCode() + value.slice(1);
      navigation.navigate('Signup Otp', {
        phone: ph,
        countryCode: phoneInput.current.getCountryCode(),
      });
      setOtpStatus(null);
    } else if (otpStatus && otpStatus != 0) {
      toast.show(otpStatus.message);
      setOtpStatus(null);
    }
  }, [otpStatus, navigation, value, toast]);

  React.useEffect(() => {
    if (route && route.params && route.params.username) {
      setValue(route.params.username);
    }
  }, [route]);

  return (
    <View style={styles.main}>
      {/* <FloatingButton
        visible={true}
        hideBackgroundOverlay
        // bottomMargin={Dimensions.get('window').width * 0.2}
        button={{
          // label: 'Share',
          onPress: () => {},
          round: true,
          iconSource: require('../../assets/images/help.png'),
        }}
      /> */}
      <View style={styles.imgWrapper}>
        <Image
          source={require('../../assets/images/POS_logo_png.png')}
          style={{ marginTop: 10, height: imgWidth * 0.3, width: imgWidth }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.phoneWrapper}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#204391',
            fontSize: 26,
            // marginVertical: Dimensions.get('window').height * 0.01,
            // width: '70%',
            textAlign: 'center',
            letterSpacing: -0.2,
            marginBottom: 0,
          }}>
          Alright, let's get
        </Text>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Medium',
            color: '#204391',
            fontSize: 26,
            marginBottom: Dimensions.get('window').height * 0.036,
            // width: '70%',
            textAlign: 'center',
            letterSpacing: -0.2,
          }}>
          you started
        </Text>
        <PhoneInput
          placeholder="Enter Mobile Number"
          ref={phoneInput}
          defaultCode="GH"
          value={route && route.params && route.params.username}
          layout="second"
          onChangeText={text => {
            setValue(text);
          }}
          onChangeFormattedText={text => {
            setFormattedValue(text);
          }}
          containerStyle={{
            marginTop: Dimensions.get('window').height * 0.02,
          }}
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

            // backgroundColor: '#fff'
          }}
          flagButtonStyle={{
            borderColor: '#ddd',
            borderWidth: 0.9,
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3,
          }}
          textInputStyle={{
            // fontFamily: 'Inter-Regular',
            fontSize: 15,
            // height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          autoFocus
        />
        <Pressable
          style={[
            styles.btn,
            {
              marginTop: 22,
              width: '100%',
              backgroundColor: '#47B749',
              borderRadius: 8,
            },
          ]}
          onPress={async () => {
            if (value.length === 0) {
              return;
            }

            if (!phoneInput.current.isValidNumber(value)) {
              toast.show('Please enter a valid phone number', {
                placement: 'top',
                type: 'danger',
              });
              return;
            }

            const ph = !value.startsWith('0')
              ? phoneInput.current.getCallingCode() + value
              : phoneInput.current.getCallingCode() + value.slice(1);

            // console.log('callllll_---');
            mutate({
              contact_phone: '+' + ph,
            });
          }}
          disabled={isLoading}>
          <Text style={styles.signin}>
            {isLoading ? 'Processing' : 'Get Started'}
          </Text>
        </Pressable>
        {/* <Pressable
          style={[
            styles.btn,
            {
              marginTop: 12,
              backgroundColor: '#224390',
            },
          ]}
          onPress={async () => {
            SheetManager.show('support');
          }}>
          <Text style={styles.signin}>Need help?</Text>
        </Pressable> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: Dimensions.get('window').height * 0.03,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: '#929292',
              fontSize: 15,
              // marginTop: 16,
            }}>
            Already on Digistore?{' '}
          </Text>
          <Pressable
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 'auto',
              paddingVertical: 12,
            }}
            onPress={() => {
              navigation.navigate('Login');
              // navigation.navigate('Signup Success');
            }}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: '#565656',
                fontSize: 16,

                // marginTop: 16,
              }}>
              {' '}
              Sign in
            </Text>
          </Pressable>
        </View>
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

export default NewUserPhone;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  phoneWrapper: {
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: Dimensions.get('window').height * 0.07,
  },
  imgWrapper: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    backgroundColor: '#F3F3F3',
  },
  btn: {
    backgroundColor: 'rgba(57, 103, 232, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 16,
    borderRadius: 3,
    width: '100%',
  },

  signin: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  btnWrapper: {
    paddingHorizontal: 24,
  },
});
