/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useToast } from 'react-native-toast-notifications';
import { RadioGroup, RadioButton } from 'react-native-ui-lib';
import Pass from '../../assets/icons/pass.svg';
import { useNavigation } from '@react-navigation/native';
import { loginApi } from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActionCreator } from '../hooks/useActionCreator';
import { Switch } from '@rneui/themed';

const ResetPass = ({ route }) => {
  const [pin, setPin] = React.useState('');
  const [pinRepeat, setPinRepeat] = React.useState('');
  const { setAuth, setCurrentUser } = useActionCreator();
  const [secureEntry, setSecureEntry] = React.useState(true);
  const [secureEntry1, setSecureEntry1] = React.useState(true);
  const navigation = useNavigation();
  const { uid } = route.params;
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  const [radio, setRadio] = React.useState('password');
  // const imgWidth = Dimensions.get('window').width * 0.7;

  // const resetPass = async _password => {
  //   setLoading(true);
  //   const response = await loginApi.put('/users/merchant/password/reset', {
  //     uid,
  //     new_pass: _password,
  //     reset_type: 'USER',
  //   });
  //   setLoading(false);
  //   return response;
  // };

  const resetPin = async _pin => {
    setLoading(true);
    const response = await loginApi.put('/users/merchant/pin/reset', {
      uid,
      new_pass: _pin,
      reset_type: 'USER',
    });
    setLoading(false);
    return response;
  };

  return (
    <View style={styles.main}>
      <Text
        style={{
          fontFamily: 'Lato-Black',
          fontSize: 26,
          color: '#204391',
          marginVertical: 22,
        }}>
        Set new 4-digit PIN
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Enter Pin'}
          placeholderTextColor="#B8BEC4"
          value={pin}
          onChangeText={setPin}
          cursorColor="#82AAE3"
          autoFocus
          keyboardType={'number-pad'}
          secureTextEntry={secureEntry}
        />

        <Pressable
          style={styles.iconWrapper}
          onPress={() => setSecureEntry(!secureEntry)}>
          <Pass style={styles.icon} />
        </Pressable>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Repeat Pin'}
          placeholderTextColor="#B8BEC4"
          value={pinRepeat}
          onChangeText={setPinRepeat}
          cursorColor="#82AAE3"
          keyboardType={'number-pad'}
          secureTextEntry={secureEntry1}
        />
        <Pressable
          style={styles.iconWrapper}
          onPress={() => setSecureEntry1(!secureEntry1)}>
          <Pass style={styles.icon} />
        </Pressable>
      </View>
      {/* <View style={{ marginVertical: 14 }}>
        <RadioGroup initialValue={radio} onValueChange={setRadio}>
          <RadioButton
            value="password"
            label={'Reset Password'}
            labelStyle={{ fontFamily: 'Lato-Semibold', fontSize: 15 }}
            color="#224390"
          />
          <View style={{ marginVertical: 8 }} />
          <RadioButton
            value="pin"
            label={'Reset Pin'}
            labelStyle={{ fontFamily: 'Lato-Semibold', fontSize: 15 }}
            color="#224390"
          />
        </RadioGroup>
      </View> */}

      <Pressable
        disabled={pin.length === 0 || pinRepeat.length === 0}
        style={[
          styles.btn,
          {
            backgroundColor: 'rgba(71, 183, 73, 0.9)',
            marginTop: 18,
          },
        ]}
        onPress={async () => {
          if (pin !== pinRepeat) {
            toast.show('Pins do not match', {
              placement: 'top',
              type: 'danger',
            });
            return;
          }
          try {
            let data;
            let out = await resetPin(pin);
            data = out.data;

            console.log('hhhhhhhhhhh', data);

            if (data && data.status == '0') {
              toast.show(data.message, {
                placement: 'top',
              });
              navigation.navigate('Login');
              return;
            }
            toast.show(data && data.message, {
              placement: 'top',
              type: 'danger',
            });
          } catch (error) {}
        }}>
        <Text style={styles.signin}>
          {loading ? 'Processing' : 'Set New Pin'}
        </Text>
      </Pressable>
    </View>
  );
};

export default ResetPass;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
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
  iconWrapper: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  label: {
    fontFamily: 'Lato-Semibold',
    color: '#30475e',
    fontSize: 16,
  },
  toggle: {
    paddingVertical: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    height: 52,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    borderColor: '#ddd',
    borderWidth: 0.9,
  },
  btn: {
    backgroundColor: '#3967E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 16,
    borderRadius: 3,
  },
  signin: {
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
});
