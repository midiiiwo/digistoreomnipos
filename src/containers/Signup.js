/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Linking,
  ScrollView,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useOnboardMerchant } from '../hooks/useOnboardMerchant';
import { Checkbox, Picker as RNPicker } from 'react-native-ui-lib';
import { useGetOnboardingRequirements } from '../hooks/useGetOnboardingRequirements';
import Picker from '../components/Picker';

const AuthInput = ({
  value,
  setValue,
  Icon,
  placeholder,
  iconHandler,
  passwordVisible,
  disabled,
  extraStyles,
  keyboardType,
  showError,
}) => {
  return (
    <View
      style={[
        styles.inputWrapper,
        { ...extraStyles, borderColor: showError ? '#EB455F' : '#ddd' },
      ]}>
      {/* <View style={styles.iconWrapper}>
        <Icon style={styles.icon} />
      </View> */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#B8BEC4"
        value={value}
        onChangeText={setValue}
        cursorColor="#82AAE3"
        secureTextEntry={passwordVisible}
        keyboardType={keyboardType}
        editable={disabled ? false : true}
      />
      {Icon && (
        <Pressable style={styles.iconWrapper} onPress={iconHandler}>
          <Icon style={styles.icon} />
        </Pressable>
      )}
    </View>
  );
};

const Signup = ({ navigation, route }) => {
  const [contactName, setContactName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [businessName, setBusinessName] = React.useState('');
  const [phoneNumber, setPhone] = React.useState('');
  const [desc, setDescription] = React.useState();
  const [country, setCountry] = React.useState();
  const [aboutUs, setAboutUs] = React.useState();
  const [referal, setReferal] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [onboardStatus, setOnboardStatus] = React.useState();
  const toast = useToast();
  const { mutate, isLoading } = useOnboardMerchant(setOnboardStatus);
  const { phone } = route.params;
  const [check, setCheck] = React.useState(false);

  const descriptions = [
    'Just Starting',
    'Freelancer/Professional',
    'Ecommerce Business',
    'Selling on social media',
    'Retail or Corner Shop',
    'Medium/Large Business',
  ];
  console.log('ooooooooooo', onboardStatus);

  React.useEffect(() => {
    if (onboardStatus && onboardStatus.status == 0) {
      // toast.show(onboardStatus.message, { placement: 'top', type: 'success' });
      navigation.navigate('Signup Success');
    } else if (onboardStatus && onboardStatus.status != 0) {
      toast.show(onboardStatus.message, { placement: 'top', type: 'danger' });
    }
  }, [onboardStatus, navigation, toast]);

  React.useEffect(() => {
    setPhone('+' + phone);
  }, [phone]);

  const { data: requirements } = useGetOnboardingRequirements();

  const channels = (
    (requirements && requirements.data && requirements.data.data.channels) ||
    []
  ).map(i => {
    if (!i) {
      return;
    }
    return {
      label: i,
      key: i,
      value: i,
    };
  });

  const currentCountries =
    requirements &&
    requirements.data &&
    requirements.data.data &&
    requirements.data.data.countries;

  const countriesToShow = (currentCountries || []).map(i => {
    if (!i) {
      return;
    }
    return {
      label: i.name,
      key: i.code,
      value: i.code,
    };
  });

  // currentCountries.forEach(i => {
  //   if (countryList[i.code]) {
  //     countriesToShow.push({
  //       key: countryList[i.code],
  //       label: countryList[i.code],
  //       value: i.code,
  //     });
  //   }
  // });

  console.log('couuuuuuuuu', country);
  //
  return (
    <ScrollView style={styles.wrapper}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: '#204391',
          fontSize: 26,
          // marginVertical: 16,
          textAlign: 'center',
          backgroundColor: '#fff',
        }}>
        You're almost
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          color: '#204391',
          fontSize: 26,
          // marginVertical: 16,
          marginBottom: 2,
          textAlign: 'center',
          backgroundColor: '#fff',
        }}>
        there
      </Text>
      <View
        style={{
          backgroundColor: '#fff',
          alignItems: 'center',
        }}>
        {/* <Image
            source={require('../../assets/images/DigiStorePOS.png')}
            style={{ marginTop: 24, height: imgWidth / 4, width: imgWidth }}
          /> */}
      </View>
      <View style={styles.form}>
        <AuthInput
          // Icon={Business}
          placeholder="Business Trading name"
          value={businessName}
          setValue={setBusinessName}
          showError={businessName.length === 0 && showError}
        />
        <AuthInput
          // Icon={User}
          showError={contactName.length === 0 && showError}
          placeholder="First and Last Name"
          value={contactName}
          setValue={setContactName}
        />

        {/* <AuthInput
            // Icon={Business}
            placeholder="Username"
            value={username}
            setValue={setUsername}
            showError={username.length === 0 && showError}
          /> */}

        <AuthInput
          // Icon={Email}
          placeholder="Email (Optional)"
          value={email}
          setValue={setEmail}
        />

        <AuthInput
          // Icon={Email}
          placeholder="Phone Number"
          value={phoneNumber}
          setValue={setPhone}
          disabled={true}
        />

        {/* <View style={{ alignItems: 'center' }}> */}

        <AuthInput
          // Icon={Email}
          placeholder="Referal Code (Optional)"
          value={referal}
          setValue={setReferal}
          // disabled={true}
          // keyboardType="number-pad"
        />
        <View>
          <Picker
            // extraStyleOuter={{ flex: 2, marginRight: 6 }}
            showError={showError && !desc}
            extraStyleOuter={{ marginVertical: 6, paddingTop: 0 }}
            placeholder="Which best describes your business"
            value={desc}
            setValue={item => {
              setDescription(item);
            }}>
            {descriptions.map(i => {
              return <RNPicker.Item key={i} label={i} value={i} />;
            })}
          </Picker>
        </View>
        <View>
          <Picker
            // extraStyleOuter={{ flex: 2, marginRight: 6 }}
            extraStyleOuter={{ marginVertical: 6, paddingTop: 0 }}
            showError={showError && !country}
            placeholder="Where is your business located"
            value={country}
            showSearch
            searchPlaceholder="Search Country"
            setValue={item => {
              setCountry(item);
            }}>
            {countriesToShow.map(i => {
              return <RNPicker.Item key={i} label={i} value={i} />;
            })}
          </Picker>
        </View>
        <View>
          <Picker
            extraStyleOuter={{ marginVertical: 6, paddingTop: 0 }}
            placeholder="How did you hear about us"
            value={aboutUs}
            setValue={item => {
              setAboutUs(item);
            }}>
            {channels.map(i => {
              return (
                <RNPicker.Item key={i.key} label={i.label} value={i.value} />
              );
            })}
          </Picker>
        </View>
        {/* </View> */}

        {/* <AuthInput
            Icon={Pass}
            placeholder="Password"
            showError={password.length === 0 && showError}
            value={password}
            setValue={setPassword}
            iconHandler={() => setPasswordVisible(!passwordVisible)}
            passwordVisible={passwordVisible}
          /> */}
        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <Checkbox
            value={check}
            onValueChange={() => setCheck(!check)}
            color="#204391"
            style={{ color: '#204391', alignSelf: 'center', marginRight: 8 }}

            // label="By clicking to create an account, you agree to iPay's Terms of Use
            // and Privacy Policy"
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Medium',
              color: '#30475e',
              lineHeight: 20,
              width: '85%',
            }}>
            By clicking to create an account, you agree to the{' '}
            {/* <Pressable
              onPress={() => {
                Linking.openURL('https://sell.digistoreafrica.com/terms');
              }}
              style={{
                // flexDirection: 'row',
                marginBottom: 0,
              }}> */}
            <Text
              onPress={() =>
                Linking.openURL('https://sell.digistoreafrica.com/terms')
              }
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
                color: '#204391',
              }}>
              Terms of Use
            </Text>
            {/* </Pressable> */}
            {/* and{' '} */}
            {/* <Pressable
              style={{
                alignItems: 'flex-end',
                alignSelf: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}> */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Medium',
                color: '#30475e',
              }}>
              {' '}
              and{' '}
            </Text>
            {/* </Pressable> */}
            {/* <Pressable
              onPress={() => {
                Linking.openURL('https://sell.digistoreafrica.com/privacy');
              }}> */}
            <Text
              onPress={() =>
                Linking.openURL('https://sell.digistoreafrica.com/privacy')
              }
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
                color: '#204391',
              }}>
              {''}
              Privacy Policy
            </Text>
            {/* </Pressable/> */}
          </Text>
        </View>
        <Pressable
          disabled={isLoading}
          style={[
            styles.btn,
            {
              backgroundColor: '#47B749',
              borderRadius: 8,
              marginBottom: 22,
            },
          ]}
          onPress={async () => {
            if (
              businessName.length === 0 ||
              contactName.length === 0 ||
              phoneNumber.length === 0 ||
              desc == null ||
              country == null
            ) {
              setShowError(true);
              return;
            }
            if (!check) {
              toast.show(
                'Please agree to the terms of use and privacy policy',
                { placement: 'top' },
              );
              return;
            }
            console.log(phoneNumber);
            mutate({
              contact_name: contactName,
              contact_phone: phoneNumber,
              contact_email: email,
              buss_name: businessName,
              buss_segment: desc && desc.value,
              buss_country: country.value,
              username: phoneNumber,
              password: '1234567',
              // otp: Otp,
              type: 'DIGISTORE BUSINESS APP',
              sales_referal: referal.length > 0 ? referal : '',
              source: 'POSAPP',
              sales_channel: (aboutUs && aboutUs.value) || '',
            });
          }}>
          <Text style={styles.signin}>
            {isLoading ? 'Processing' : 'Sign up'}
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
        {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 18,
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                color: '#30475e',
                fontSize: 16,
                // marginTop: 16,
              }}>
              Already have an account?{' '}
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
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: 'rgba(71, 183, 73, 0.9)',
                  fontSize: 16,

                  // marginTop: 16,
                }}>
                {' '}
                Sign in
              </Text>
            </Pressable>
          </View> */}
      </View>
      {/* <FAB
        icon={props => <Help {...props} />}
        style={styles.fab}
        onPress={() => SheetManager.show('support')}
        mode="flat"
      /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 22,
  },
  iconWrapper: {
    borderLeftColor: '#ccc',
    borderLeftWidth: 0.9,
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

  wrapper: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    // position: 'absolute',
    // bottom: 0,
    // marginBottom: 22,
    // borderTopEndRadius: 24,
    // borderTopLeftRadius: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    backgroundColor: '#F3F3F3',
  },
  form: {
    paddingHorizontal: 30,
    paddingTop: 10,
  },
  input: {
    height: '100%',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingLeft: 16,
    fontSize: 16,
    flex: 1,
    color: '#30475e',
    fontFamily: 'Lato-Regular',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    height: 52,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderColor: '#ddd',
    borderWidth: 0.9,
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
});

export default Signup;
