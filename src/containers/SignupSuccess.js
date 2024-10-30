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

const SignupSuccess = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  // const [password, setPassword] = React.useState('');
  const [btnText, setBtnText] = React.useState('Login');
  const segments = [{ label: 'Use Mobile Number' }, { label: 'Use Username' }];
  // const [verifyUserStatus, setVerifyUserStatus] = React.useState(false);
  const toast = useToast();
  const [usernameType, setUsernameType] = React.useState(0);
  const phoneInput = React.useRef(null);

  // const { setAuth, setPinState } = useActionCreator();
  // const [secureEntry, setSecureEntry] = React.useState(true);

  // const showEnterPinLock = React.useCallback(async () => {
  //   const hasPin = await hasUserSetPinCode();
  //   if (hasPin) {
  //     setPinState(() => ({ pinStatus: 'enter', showPin: true }));
  //   } else {
  //     setPinState(() => ({ pinStatus: 'choose', showPin: true }));
  //   }
  // }, [setPinState]);

  // React.useEffect(() => {
  //   showEnterPinLock();
  // }, [showEnterPinLock]);

  // React.useLayoutEffect(() => {
  //   const verifyUser = async () => {
  //     const user_ = await AsyncStorage.getItem('user');
  //     const user = JSON.parse(user_);
  //     // appGlobal.setAppGlobal({...appGlobal.appGlobal, user});

  //     if (user && user.sid) {
  //       navigation.replace('Home');
  //     }
  //   };

  //   verifyUser();
  // }, [navigation]);

  const checkUser = async user => {
    setBtnText('Processing');
    const response = await loginApi.get(`/login/pin/user/${user}`);
    return response;
  };

  // React.useEffect(() => {
  //   setVerifyUserStatus(false);
  // }, []);

  // const { setCurrentUser } = useActionCreator();
  const imgWidth = Dimensions.get('window').width * 0.6;
  return (
    <View style={styles.main}>
      {/* <FloatingButton
        visible={true}
        hideBackgroundOverlay
        style={{ height: 28, width: 28 }}
        // bottomMargin={Dimensions.get('window').width * 0.2}
        button={{
          // label: 'Share',
          onPress: () => {},
          round: true,
          backgroundColor: '#F3F3F3',
          height: 32,
          width: 32,
          // iconstyle: {
          //   height: '100%',
          //   width: '100%',
          // },
          // iconSource: require('../../assets/images/image-removebg-preview (1).png'),
        }}
      /> */}

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
              fontFamily: 'Inter-SemiBold',
              color: '#47B749',
              fontSize: 28,
              // marginVertical: Dimensions.get('window').height * 0.03,
              // width: Dimensions.get('window').width * 0.45,
              textAlign: 'center',
            }}>
            Congratulations
          </Text>
          <Text
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#30475e',
              fontSize: 14,
              marginVertical: Dimensions.get('window').height * 0.05,
              marginTop: Dimensions.get('window').height * 0.026,
              textAlign: 'center',
              maxWidth: '85%',
            }}>
            Your business registration is successful. Login and get started on
            your journey to business success
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
        </View>

        <View style={styles.form}>
          {usernameType === 1 && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mobile number or Username"
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
              // onChangeFormattedText={text => {
              //   setUsername(text);
              // }}
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
            // if (verifyUserStatus) {
            //   try {
            //     const { data } = await signin(username, password);
            //     if (data.status == '0') {
            //       await AsyncStorage.setItem('user', JSON.stringify(data));
            //       setCurrentUser({
            //         ...data,
            //         merchant: data.user_merchant_id,
            //         outlet: data.user_merchant_group_id,
            //       });
            //       setAuth(true);
            //       // setPinState({ pinStatus: 'enter', showPin: false });
            //       navigation.replace('Dashboard');

            //       setBtnText('Sign in');
            //       return;
            //     }
            //     toast.show(data.message, {
            //       placement: 'top',
            //       type: 'danger',
            //     });
            //     setVerifyUserStatus(false);
            //     setBtnText('Get started');
            //   } catch (error) {}
            // } else {
            try {
              const ph = phone.startsWith('0') ? phone : '0' + phone;
              const userCred = usernameType === 1 ? username : ph;
              const { data } = await checkUser(encodeURIComponent(userCred));
              if (data && data.status == '0') {
                // if (data.is_admin !== 'YES') {
                if (data && data.has_pin == 'YES') {
                  navigation.navigate('LockScreen', { username: userCred });
                } else if (
                  data &&
                  data.has_pin == 'NO' &&
                  data.has_otp == 'YES'
                ) {
                  navigation.navigate('Reset Otp', { uid: data.uid });
                } else {
                  navigation.navigate('Set Pin', { uid: data.uid });
                }

                // } else {
                // navigation.navigate('Password', { username });
                // }
                setBtnText('Get started');
                return;
              }
              toast.show(`User ${userCred} does not exist`, {
                type: 'danger',
                placement: 'top',
              });
              console.log(userCred);
              const usernameIsPhone =
                userCred.match(
                  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
                ) &&
                (userCred.length === 10 || userCred.length === 9);
              if (usernameIsPhone) {
                navigation.navigate('NewUserPhone', { username: userCred });
              } else {
                navigation.navigate('NewUserPhone');
              }

              setBtnText('Get started');
            } catch (error) {
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
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: Dimensions.get('window').height * 0.06,
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
        </View> */}
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
    // paddingTop: 14,
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
    paddingTop: 14,

    // position: 'absolute',
    // bottom: 0,
    // borderTopEndRadius: 24,
    // borderTopLeftRadius: 24,
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.04,
  },
  form: {
    paddingHorizontal: 30,
    paddingTop: 25,
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
    fontFamily: 'SFProDisplay-Semibold',
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

export default SignupSuccess;
