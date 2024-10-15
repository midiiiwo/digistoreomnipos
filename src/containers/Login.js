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

const Login = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  // const [password, setPassword] = React.useState('');
  const [btnText, setBtnText] = React.useState('Continue');
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

  const checkUser = async user_ => {
    setBtnText('Processing');
    const response = await loginApi.get(`/login/pin/user/${user_}`);
    setBtnText('Continue');
    return response;
  };

  // React.useEffect(() => {
  //   setVerifyUserStatus(false);
  // }, []);

  // const { setCurrentUser } = useActionCreator();
  const imgWidth = Dimensions.get('window').width * 0.3;
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
            style={{ marginTop: 10, height: imgWidth * 0.2, width: imgWidth }}
            resizeMode="contain"
          />
        </View>

        {/* <Logo /> */}

        <View
          style={{
            // backgroundColor: 'red',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#204391',
              fontSize: 28,
              // marginVertical: Dimensions.get('window').height * 0.03,
              // width: Dimensions.get('window').width * 0.45,
              textAlign: 'center',
            }}>
            Let's get you
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'SFProDisplay-Medium',
              color: '#204391',
              fontSize: 28,
              // marginVertical: Dimensions.get('window').height * 0.03,
              // marginTop: Dimensions.get('window').height * 0.01,
              // width: Dimensions.get('window').width * 0.45,
              marginBottom: Dimensions.get('window').height * 0.03,
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
          <View style={{ marginVertical: 20 }} />
        </View>
        <View
          style={[
            styles.form,
            { paddingHorizontal: Dimensions.get('window').width * 0.083 },
          ]}>
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
              containerStyle={{
                paddingHorizontal: Dimensions.get('window').width * 0.07,
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
              let userCred;
              // const userCred = usernameType === 1 ? username : ph;
              let data;
              if (usernameType === 1) {
                const out = await checkUser(encodeURIComponent(username));
                userCred = username;
                data = out.data;
              } else {
                const ph = phone.startsWith('0')
                  ? '+' + phoneInput.current.getCallingCode() + phone.slice(1)
                  : '+' + phoneInput.current.getCallingCode() + phone;
                console.log('phohphphphphp', ph);
                const out = await checkUser(encodeURIComponent(ph));
                userCred = ph;
                data = out.data;
              }

              if (data && data.status == '0') {
                // if (data.is_admin !== 'YES') {
                if (data && data.has_pin == 'YES') {
                  navigation.navigate('LockScreen', { username: userCred });
                } else {
                  navigation.navigate('Set Pin', { uid: data.uid });
                }

                // } else {
                // navigation.navigate('Password', { username });
                // }
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
              console.log(error);
              toast.show('Check your network');
              setBtnText('Continue');
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
    paddingHorizontal: Dimensions.get('window').width * 0.1,

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
