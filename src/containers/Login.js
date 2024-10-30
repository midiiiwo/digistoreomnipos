/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { loginApi } from '../api/axiosInstance';
import { SheetManager } from 'react-native-actions-sheet';
import { SegmentedControl } from 'react-native-ui-lib';
import PhoneInput from 'react-native-phone-number-input';
import Help from '../../assets/icons/help.svg';
import { FAB } from 'react-native-paper';
import { useQuery } from 'react-query';
import axios from 'axios';
import Loading from '../components/Loading';

function useGetAvailableCountries() {
  const queryResult = useQuery(
    ['available-countries'],
    () =>
      axios.get(
        'https://storage.googleapis.com/digibox-managed/be/ur210328401d1ca816804f171a933e3ca31ff6IPBM.json',
      ),
    { staleTime: Infinity, cacheTime: 1000 * 60 * 60 * 24 },
  );
  return queryResult;
}

const Login = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  // const [password, setPassword] = React.useState('');
  const [btnText, setBtnText] = React.useState('Continue');
  const segments = [{ label: 'Use Mobile Number' }, { label: 'Use Username' }];
  const { data, isLoading } = useGetAvailableCountries();
  // const [verifyUserStatus, setVerifyUserStatus] = React.useState(false);
  const toast = useToast();
  const [usernameType, setUsernameType] = React.useState(0);
  const phoneInput = React.useRef(null);

  const checkUser = async user_ => {
    setBtnText('Processing');
    const response = await loginApi.get(`/login/pin/user/${user_?.trim()}`);
    return response;
  };
  const imgWidth = Dimensions.get('window').width * 0.58;

  if (isLoading) {
    return <Loading />;
  }
  const availableCountries = data && data.data;
  return (
    <View style={styles.main}>
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../assets/images/POS_logo_png.png')}
            style={{ marginTop: 10, height: imgWidth * 0.3, width: imgWidth }}
            resizeMode="contain"
          />
        </View>

        {/* <Logo /> */}

        <View
          style={{
            // backgroundColor: 'red',
            alignItems: 'center',
            marginTop: 38,
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#204391',
              fontSize: 26,

              textAlign: 'center',
            }}>
            Let's get you
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#204391',
              fontSize: 26,

              marginBottom: Dimensions.get('window').height * 0.05,
              textAlign: 'center',
            }}>
            back in
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
          />
          <View style={{ marginVertical: 8 }} />
        </View>

        <View style={styles.form}>
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
            <PhoneInput
              ref={phoneInput}
              defaultCode="GH"
              value={phone}
              layout="second"
              onChangeText={text => {
                setPhone(text);
              }}
              textInputProps={{
                editable: true,
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
                // fontFamily: 'Inter-Regular',
                fontSize: 15,
                // height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              countryPickerProps={{
                withFlag: false,
                countryCodes: Object.keys(availableCountries),
              }}
              // autoFocus
            />
            // </View>
          )}
        </View>
        <Pressable
          // disabled={username.length === 0}
          style={[
            styles.btn,
            {
              backgroundColor: '#47B749',
              borderRadius: 8,
              width: '84%',
            },
          ]}
          onPress={async () => {
            try {
              let userCred;
              // const userCred = usernameType === 1 ? username : ph;
              let data;
              if (usernameType === 1) {
                const out = await checkUser(
                  encodeURIComponent(username?.trim()),
                );
                userCred = username;
                data = out.data;
              } else {
                const ph = phone.startsWith('0')
                  ? '+' + phoneInput.current.getCallingCode() + phone.slice(1)
                  : '+' + phoneInput.current.getCallingCode() + phone;
                const out = await checkUser(encodeURIComponent(ph));
                userCred = ph;
                data = out.data;
              }

              if (data && data.status == '0') {
                // if (data.is_admin !== 'YES') {
                if (data && data.has_pin == 'YES') {
                  navigation.navigate('LockScreen', { username: userCred });
                } else if (
                  data &&
                  data.has_pin == 'NO' &&
                  data.has_otp == 'YES'
                ) {
                  navigation.navigate('Reset Otp', {
                    uid: data.uid,
                    destination: userCred,
                  });
                } else {
                  navigation.navigate('Set Pin', { uid: data.uid });
                }
                setBtnText('Get started');
                return;
              }
              if (data && data.status == '91') {
                toast.show(data.message, {
                  type: 'danger',
                  placement: 'top',
                });
                return;
              }
              toast.show(data?.message, {
                type: 'danger',
                placement: 'top',
              });
              const usernameIsPhone =
                userCred.match(
                  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
                ) &&
                (userCred.length === 13 || userCred.length === 14);
              if (usernameIsPhone) {
                navigation.navigate('NewUserPhone', {
                  username: userCred.slice(4),
                });
              } else {
                navigation.navigate('NewUserPhone');
              }

              setBtnText('Get started');
            } catch (error) {
              console.log(error);
              toast.show('Check your network');
              setBtnText('Get started');
            }
            // }
          }}>
          <Text style={styles.signin}>{btnText}</Text>
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
            marginTop: Dimensions.get('window').height * 0.04,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              color: '#929292',
              fontSize: 15,
              // marginTop: 16,
            }}>
            New to Digistore?{' '}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('NewUserPhone')}
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 'auto',
              paddingVertical: 12,
            }}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                color: '#565656',
                fontSize: 16,

                // marginTop: 16,
              }}>
              {' '}
              Sign up
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

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#82AAE3',
  },
  iconWrapper: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'red',
    fontSize: 9,
  },
  icon: {
    marginHorizontal: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    backgroundColor: '#F3F3F3',
  },
  wrapper: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    alignItems: 'center',

    // position: 'absolute',
    // bottom: 0,
    // borderTopEndRadius: 24,
    // borderTopLeftRadius: 24,
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1,
  },
  form: {
    paddingHorizontal: 30,
    // paddingTop: 5,
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
    width: '100%',
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  arbitrary: { height: 35, borderRadius: 5 },
  segmentedControlWrapper: {
    paddingHorizontal: 10,
    width: '70%',
  },
  activeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Lato-Medium',
  },
  inactiveText: {
    fontSize: 14,
    color: '#1942D8',
    fontFamily: 'Lato-Medium',
  },
});

export default Login;
